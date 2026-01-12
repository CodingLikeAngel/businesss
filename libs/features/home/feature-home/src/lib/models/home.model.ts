export interface HomeSection {
  id: string;
  type: string;
  visible: boolean;
}

export interface BaseItem {
  description: string;
}

export interface ServiceItem extends BaseItem {
  serviceName: string;
  icon?: string;
}

export interface ProductItem extends BaseItem {
  name: string;
  image: string;
  price: string;
}

export interface CartItem extends ProductItem {
  quantity: number;
}

export interface ModalState {
  isOpen: boolean;
  selectedItem: ServiceItem | ProductItem | null;
}

export interface HomeState {
  isMobile: boolean;
  modalState: ModalState;
  cartItems: CartItem[];
}