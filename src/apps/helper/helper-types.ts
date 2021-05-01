export type ToNodeType = {
  letter?: string
  can: boolean
  node?: number
}

export interface NodeType {
  nextDown: ToNodeType[]
  terminal: number
}

export type StatProps = {
  info?: string
}

export type StatWithDateProps = StatProps & {
  date: Date
}

export type TryFindStringType = {
  have: boolean
  node?: number
}
