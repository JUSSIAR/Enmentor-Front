import React from 'react'
import {
  ToNodeType,
  NodeType,
  StatProps,
  StatWithDateProps,
  TryFindStringType,
} from './helper-types'

const DEFAULT_INFO: string = 'no_info'

class TROUBLE {
  static letter: string = "INVALID LETTER"
  static node: string = "INVALID NODE"
}

const generateDefault = (): ToNodeType[] => {
  const result: ToNodeType[] = new Array<ToNodeType>()
  return result
}

class Node implements NodeType {
  public nextDown: ToNodeType[]
  public terminal: number
  private letters: Map<string, number>
  readonly id: number

  constructor(id: number) {
    this.id = id
    this.nextDown = generateDefault()
    this.terminal = 0
    this.letters = new Map<string, number>([])
  }

  public checkLetter(key: string): boolean {
    return this.letters.has(key)
  }

  public addNewLetter(key: string, nodeNumber: number): void {
    if (key.length !== 1) {
      console.error(TROUBLE.letter)
      console.info("Length !== 1")
      return 
    }
    this.nextDown.push({
      can: true,
      node: nodeNumber,
      letter: key,
    })
    this.letters.set(key, this.nextDown.length - 1)
  }

  public index(key: string): number | undefined {
    return this.letters.get(key)
  }
}

abstract class StringDataStucture {
  abstract addNewString(newString: string): void;
  abstract removeString(newString: string): boolean;
  abstract findString(newString: string): boolean;
  abstract startWithString(newString: string): string[];
}

class StatWithDate {
  static totalCount: number = 0
  static dateArray: Date[] = []
  static info: string[] = []
  readonly ownId: number

  static increment(): void {
    StatWithDate.totalCount++ 
  }

  static addNewStruct(newStruct: StatWithDateProps): void {
    StatWithDate.dateArray.push(newStruct.date)
    switch(typeof newStruct?.info) {
      case 'string': {
        StatWithDate.info.push(newStruct.info)
        break
      }
      default: {
        StatWithDate.info.push(DEFAULT_INFO)
      }
    }
  }

  constructor(data: StatProps) {
    const currentDate = new Date()
    StatWithDate.increment()
    StatWithDate.addNewStruct({
      ...data,
      date: currentDate
    })
    this.ownId = StatWithDate.totalCount
  }

  get myId(): number {
    return this.ownId
  }
}

// multiset version
export default class SmartStringSet extends StringDataStucture {
  private stat: StatWithDate
  private root: number
  private nodeArray: Node[]

  constructor() {
    super()
    this.stat = new StatWithDate({info: undefined})
    this.root = 0
    this.nodeArray = [new Node(StatWithDate.totalCount)]
  }

  get statistics(): StatWithDate {
    return this.stat
  }

  private tryFindString(stringToFind: string): TryFindStringType {
    let currentNode: number = this.root
    const answer: TryFindStringType = {have: false}
    for (const letter of stringToFind.split('')) {
      if (!this.nodeArray[currentNode].checkLetter(letter)) {
        return answer
      }
      const nextId: any = this.nodeArray[currentNode].index(letter)
      if (nextId && this.nodeArray[currentNode].nextDown[nextId].can) {
        currentNode = this.nodeArray[currentNode].nextDown[nextId].node as number
      } else {
        return answer
      }
    }
    if (this.nodeArray[currentNode].terminal <= 0) {
      return answer
    }
    answer.have = true
    return {
      ...answer,
      node: currentNode
    }
  }

  private depthFirstSearch(
    currentVertex: number, 
    currentString: string,
  ): string[] {
    let answer: string[] = []
    if (this.nodeArray[currentVertex].terminal > 0) {
      answer.push(currentString)
    }
    for (const nextNode of this.nodeArray[currentVertex].nextDown) {
      if (nextNode.can && nextNode.node) {
        answer = [
          ...answer, 
          ...this.depthFirstSearch(nextNode.node, currentString + nextNode.letter),
        ]
      }
    }
    return answer
  }

  public addNewString(newString: string): void {
    let currentNode: number = this.root
    newString.split('').forEach(letter => {
      if (!this.nodeArray[currentNode].checkLetter(letter)) {
        const len: number = this.nodeArray.length
        this.nodeArray.push(new Node(this.stat.myId))
        this.nodeArray[currentNode].addNewLetter(letter, len)
      }
      const nextId: any = this.nodeArray[currentNode].index(letter)
      if (typeof nextId === 'number') {
        const next: any = this.nodeArray[currentNode].nextDown[nextId].node
        if (next !== undefined) {
          currentNode = next
        } else {
          console.error(TROUBLE.node)
          console.info("Can: false")
        }
      }
    })
    this.nodeArray[currentNode].terminal++
  }

  public removeString(stringToRemove: string): boolean {
    const resp: TryFindStringType = this.tryFindString(stringToRemove)
    if (resp.have) {
      this.nodeArray[resp.node as number].terminal--
    }
    return resp.have
  }

  public findString(stringToFind: string): boolean {
    return this.tryFindString(stringToFind).have
  }

  public startWithString(prefixString: string): string[] {
    const resp: TryFindStringType = this.tryFindString(prefixString)
    return resp.have
      ? this.depthFirstSearch(resp.node as number, prefixString)
      : []
  }
}
