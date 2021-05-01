import React, {FC, useState} from 'react'
import SmartStringSet from './helper-structure'

type Props = {
  tree?: SmartStringSet
  addNewString?: () => void
}

const HelperComponent: FC<Props> = ({tree}) => {
  const [helpList, setHelpList] = useState(new Array<string>())

  const getLastWord = (sentence: string): string => {
    const array: string[] = sentence.split(' ')
    return array.reduce((acc: string[], word: string) => {
      return [...acc, word]
    }, [""])[array.length]
  }

  const changeHelper = (event: any) => {
    const {value: sentence} = event.target
    const word: string = getLastWord(sentence)
    const newHelpList: string[] = tree?.startWithString(word) || []
    setHelpList((old: string[]) => {
      console.info(old)
      return newHelpList
    })
  }

  return (
    <div className="helperRoot">
      <textarea 
        placeholder="Type your answer here..."
        onChange={changeHelper}
      >
        {Boolean(helpList)}
      </textarea>
    </div>
  )
}

export default HelperComponent;
