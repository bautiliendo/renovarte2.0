import { Search } from "lucide-react";
import { useRouter, useSearchParams, } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Menu } from "lucide-react";
import Image from "next/image";

export function NavbarContent() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter();
    const searchParams = useSearchParams();


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push("/products");
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(e);
        }
    }

    useEffect(() => {
        const currentQuery = searchParams.get('query') || ''
        setSearchQuery(currentQuery)
    }, [searchParams])

    return (
        <header className="sticky top-0 z-50 w-fullbg-background/100 backdrop-blur supports-[backdrop-filter]:bg-background/100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 container flex flex-col md:flex-row md:h-16 items-center justify-between py-2 md:py-0">
                {/* Logo + Desktop Nav */}
                <div className="flex w-full md:w-auto items-center justify-between md:justify-start mb-2 md:mb-0">
                    <Link href="/" className="items-center space-x-2 my-2">
                        <Image src="/Renovartelogo(1).png" alt="Renovarte" width={140} height={140} />
                    </Link>

                    {/* Mobile: Hamburger menu - Moved to be a direct child for justify-between */}
                    <div className="md:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="p-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                >
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="pr-0 pt-10">
                                <nav className="grid gap-y-8 px-6 py-6">
                                    <Link
                                        href="/products"
                                        className="text-lg font-medium text-center hover:text-foreground/80"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Productos
                                    </Link>
                                    <Link
                                        href="/business"
                                        className="text-lg font-medium text-center hover:text-foreground/80"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Nosotros
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Searchbar */}
                <div className="w-full md:w-auto mb-2 md:mb-0 md:ml-6">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            className="pl-8 md:w-[300px] lg:w-[400px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </form>
                </div>

                {/* Desktop Nav Links + Cart */}
                <div className="hidden md:flex items-center space-x-8">
                    <nav className="flex items-center space-x-8 text-md font-medium">
                        <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground">
                            Productos
                        </Link>
                        <Link href="/business" className="transition-colors hover:text-foreground/80 text-foreground">
                            Nosotros
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}