const EllipsisText = require('../dist/ellipsis-text.umd')
const puppeteer = require('puppeteer')
jest.setTimeout(300000)
module.exports = async function(data) {
  const browser = await puppeteer.launch({})
  const page = await browser.newPage()
  await page.addScriptTag({
    content: EllipsisText.toString()
  })
  const res = await page.evaluate(
    options => {
      return new Promise(resolve => {
        const data = options.data
        const performance = []
        const keys = Object.keys(data)
        let n = 0
        function test(n) {
          const key = keys[n]
          if (!key) {
            resolve(performance)
          }
          const div = document.createElement('div')
          div.style.fontSize = '16px'
          div.style.width = '40px'
          div.style.height = '40px'
          document.body.appendChild(div)
          let time1 = Date.now()
          new EllipsisText(div, {
            str: data[key],
            callback: function(res) {
              document.body.removeChild(div)
              performance.push({
                type: key,
                res: res,
                time: Date.now() - time1
              })
              test(++n)
            }
          })
        }
        test(n)
      })
    },
    {
      data: data
    }
  )
  await browser.close()
  return res
}
