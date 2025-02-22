import { getCollection } from 'astro:content'
// 获取所有读书列表
async function getAllBooks() {
  const allPosts = await getCollection('books', ({ data }) => {
    return data
  })

  return allPosts
}

// 获取所有图书，最后阅读时间降序
export async function getSortedBooks() {
  const allBooks = await getAllBooks()

  return allBooks.sort((a, b) => {
    return b.data.lastReadDate.valueOf() - a.data.lastReadDate.valueOf()
  })
}

export async function getAllSummary() {
  const allBooks = await getSortedBooks()

  const list: {
    cover: string
    author: string
    progress: string
    lastReadDate: Date
    readingTime: string
    totalReadDay: number
    isbn: number | null
    id: string
    slug: string
  }[] = []

  allBooks.map((item) => {
    list.push({
      id: item.id,
      slug: item.slug,
      cover: item.data.cover,
      author: item.data.author,
      progress: item.data.progress,
      lastReadDate: item.data.lastReadDate,
      readingTime: item.data.readingTime,
      totalReadDay: item.data.totalReadDay,
      isbn: item.data.isbn ?? null,
    })
  })

  return list
}

// 获取所有图书分类
export async function getCatagories() {
  const allBooks = await getAllBooks()

  const catagoriesMap = new Map<string, number>()

  allBooks.forEach((item) => {
    if ('slug' in item && typeof item.slug == 'string') {
      const catagory = item.slug.split('/')[0]
      const curTagCount = catagoriesMap.get(catagory)
      if (typeof curTagCount == 'undefined') {
        catagoriesMap.set(catagory, 1)
      } else {
        catagoriesMap.set(catagory, curTagCount + 1)
      }
    }
  })

  const catagoriesList: { name: string; slug: string; count: number }[] = []

  Array.from(catagoriesMap.entries()).flatMap((item) => {
    catagoriesList.push({
      name: item[0],
      slug: '',
      count: item[1],
    })
  })

  return Array.from(catagoriesList)
}

// 随机取一条笔记

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function parseAndHighlight(text: string) {
  const preText = text.split('\n\n')
  // 定义正则表达式匹配模式
  const highlightPattern = /📌 (.+?)(?=\n|$)/g
  const underlinePattern = / ⏱ (.+?)(?=\n|$)/g
  const otherPattern = /\^[0-9-]+/g
  const titlePattern = /\[!abstract].+/g

  let title = text.match(titlePattern)?.[0] ?? ''
  title = title.split(' ')[1]

  const texts: string[][] = []

  preText.map((text) => {
    // 处理高亮标记
    let highlightedText = text.match(highlightPattern)?.[0] ?? ''
    highlightedText = highlightedText.replace(otherPattern, '')
    // 处理划线标记
    let timeText = text.match(underlinePattern)?.[0] ?? ''
    timeText = timeText.replace(otherPattern, '')
    if (highlightedText.length > 0 && timeText.length > 0) {
      texts.push([`${highlightedText}--《${title}》`, timeText])
    }
  })

  return {
    texts,
  }
}

function getRandomElements<T>(arr: T[], count: number): T[] {
  const result = []
  const arrCopy = [...arr]

  if (arr.length < count) {
    throw new Error('Array does not have enough elements.')
  }

  for (let i = arrCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]]
  }

  return arrCopy.slice(0, count)
}

export async function getRandNote() {
  const allBooks = await getSortedBooks()

  const allSliceSentences = allBooks.reduce((t, i) => {
    return [...t, ...parseAndHighlight(i.body).texts]
  }, new Array())

  const len = allSliceSentences.length

  const sliceArr = getRandomElements(allSliceSentences, Math.min(len, 10))

  return {
    total: Math.min(len, 10),
    sentences: sliceArr,
  }
}
