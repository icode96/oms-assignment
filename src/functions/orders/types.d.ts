export interface OrderLine {
  ItemId: string
  Quantity: number
  PricePerItem: number
  TotalPrice: number
}

export interface Order {
  OrderId: string
  TotalPrice: number
  OrderLines: Array<OrderLine>
}
