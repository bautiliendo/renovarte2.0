export interface ApiCredentials {
  id: number;
  username: string;
  password?: string;
}

export interface ErrorInfo {
  context?: string;
  message: string;
}

export interface ProductApi {
  item_id: number;
  codigo: string;
  ean: string;
  partNumber: string;
  item_desc_0: string;
  item_desc_1?: string;
  item_desc_2?: string;
  marca: string;
  categoria: string;
  subcategoria: string;
  peso_gr: number;
  alto_cm: number;
  ancho_cm: number;
  largo_cm: number;
  volumen_cm3: number;
  precioNeto_USD: number;
  impuestos: { imp_desc: string; imp_porcentaje: number }[];
  stock_mdp: number;
  stock_caba: number;
  url_imagenes: { url: string }[];
}
