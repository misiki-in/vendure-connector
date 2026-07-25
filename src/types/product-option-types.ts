export interface ProductOption {
  id: string
  name: string
  values: OptionValue[]
}

export interface OptionValue {
  value: string
  available?: boolean
  selected?: boolean
}
