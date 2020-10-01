import {
  speak
} from '../../../../helpers/helpers'
export function toolbarClick (buttonId) {
  console.log('toolbarClick', buttonId)
  buttonId === 'add' && this.openAddDocument()
  buttonId === 'edit' && this.openEditDocument()
  buttonId === 'delete' && this.softDeleteSelected()
  buttonId === 'restore' && this.restoreDeleted()
  buttonId === 'refresh' && (async () => { await this.feedGrid(true) })()
  buttonId === 'delete_hard' && this.hardDeleteSelected()
  buttonId === 'simple_search' && (async () => { await this.searchSimple() })()
  buttonId === 'export2PDF' && this.export2PDF()
  buttonId === 'export2Excel' && this.export2Excel()
  buttonId === 'preview' && this.preview()
  if (buttonId === 'voice') {
    const createDocumentCommands = [
      'create document',
      'create record',
      'create new record',
      'create new item',
      'add document',
      'add record',
      'add new record',
      'add new item',
      'add',
      'create'
    ]

    const updateDocumentCommands = [
      'update document',
      'update record',
      'update item',
      'edit document',
      'edit record',
      'edit item',
      'update it document',
      'update it record',
      'update it item',
      'edit it document',
      'edit it record',
      'edit it item',
      'update her document',
      'update her record',
      'update her item',
      'edit her document',
      'edit her record',
      'edit her item',
      'update his document',
      'update his record',
      'update his item',
      'edit his document',
      'edit his record',
      'edit his item'
    ]

    const findDocumentCommands = [
      'search for',
      'find',
      'search',
      'look for',
      'search record',
      'find record',
      'search item',
      'find item',
      'search document',
      'find document',
      'search records',
      'find records',
      'search items',
      'find items',
      'search documents',
      'find documents'
    ]

    const allCommands = [...createDocumentCommands, findDocumentCommands]
    // console.log('window.webkitSpeechRecognition', window.webkitSpeechRecognition)
    // Speech recognition support. Talk to your apps!
    const grammar = `#JSGF V1.0; grammar words; public <word> = ${allCommands.join(' | ')};`
    // eslint-disable-next-line
    const recognition = new window.webkitSpeechRecognition();
    // eslint-disable-next-line
    const speechRecognitionList = new window.webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1)
    recognition.grammars = speechRecognitionList
    recognition.continuous = false
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onspeechend = () => {
      recognition.stop()
    }

    recognition.onnomatch = (event) => {
      speak(`I'm sorry ${this.session.user.human.first_name}, I didn't recognise that command!`)
    }

    recognition.onerror = (event) => {
      speak(`I'm sorry ${this.session.user.human.first_name}, Error occurred in recognition!`)
      console.log('Error occurred in recognition: ' + event.error)
    }
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      console.log(event.results)
      console.log('Result received: ' + result)
      if (createDocumentCommands.indexOf(result.toLowerCase()) > -1) {
        speak(`Ok ${this.session.user.human.first_name}, I got it!`)
        this.openAddDocument()
      } else if (updateDocumentCommands.indexOf(result.toLowerCase()) > -1) {
        speak(`Ok ${this.session.user.human.first_name}, I got it!`)
        this.openEditDocument()
      } else {
        (async () => {
          console.error('do search')
          let found = false
          for (let x = 0; x < findDocumentCommands.length; x++) {
            const command = findDocumentCommands[x]
            if (result.toLowerCase().indexOf(`${command} `) > -1) found = command
          }
          if (!found) return
          speak(`Ok ${this.session.user.human.first_name}, I got it!`)
          let string = result.split(`${found} `)[1]
          let subAction = ''
          updateDocumentCommands.forEach(cmd => {
            const subStr = `and ${cmd}`
            console.error(subStr)
            if (string.toLowerCase().indexOf(subStr)) {
              string = string.replace(new RegExp(subStr, 'gi'), '')
              subAction = 'edit'
            }
          })
          console.error(string)
          // if (subAction === '') return;
          this.toolbarSimpleSearchfield.jqxInput('val', string)
          await this.searchSimple(subAction)
        })()
      }
    }

    recognition.start()
    /* recognition.onend = function (event) {
      console.error('recognition end', event)
      // recognition.start()
    }

    recognition.start = function (event) {
      console.error('recognition start', event)
    } */
  }
}
