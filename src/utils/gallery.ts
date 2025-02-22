import { getCollection } from 'astro:content'
// 获取所有画廊列表
async function getAllGalleries() {
  const allGalleries = await getCollection('gallery', ({ data }) => {
    return data
  })

  return allGalleries
}

async function preHandleUnit(text: string): Promise<string[]> {
  const pattern = /```([\s\S]*?)```/g

  const matchRes = text.match(pattern)
  if (matchRes == null) {
    return []
  } else {
    return matchRes
  }
}

async function handleParse(text: string, pattern: RegExp, prefixPattern: RegExp) {
  const matchRes = text.match(pattern)

  if (matchRes == null) {
    return ''
  } else {
    return matchRes[0].replace(prefixPattern, '')
  }
}

async function parseGarrleryMeta(params: string) {
  const titlePattern = /title.+/g
  const descPattern = /desc.+/g
  const datePattern = /date.+/g
  const authorPattern = /author.+/g

  const titlePrefix = /title\s+/g
  const descPrefix = /desc\s+/g
  const datePrefix = /date\s+/g
  const authorPrefix = /author\s+/g

  const title = await handleParse(params, titlePattern, titlePrefix)
  const desc = await handleParse(params, descPattern, descPrefix)
  const date = await handleParse(params, datePattern, datePrefix)
  const author = await handleParse(params, authorPattern, authorPrefix)

  return {
    title,
    desc,
    date,
    author,
  }
}

async function parseImgMeta(params: string) {
  const imgPattern = /img\s{1}(\w|\:|\/|\.|\-)*/g
  const imgDescPattern = /-\s{1}>\s{1}.*/g

  const imgPrefix = /img\s+/g
  const imgDescPrefix = /\-\s\>\s+/g

  const imgs: string[] = []
  const imgsAndDesc: {
    img: string
    desc: string
  }[] = []

  const imgMatch = params.match(imgPattern)
  const imgDescMatch = params.match(imgDescPattern)

  if (imgMatch != null && imgDescMatch != null) {
    for (let i = 0; i < imgMatch.length; i++) {
      const imgText = imgMatch[i].replace(imgPrefix, '')
      const descText = imgDescMatch[i].replace(imgDescPrefix, '')
      imgs.push(imgText)

      imgsAndDesc.push({
        img: imgText,
        desc: descText,
      })
    }
  }

  return {
    imgs,
    imgsAndDesc,
  }
}

async function parseGallery() {
  const gallerieString = await getAllGalleries()
  const preText = await preHandleUnit(gallerieString[0].body)

  const galleriesPromise = preText.map(async (item) => {
    const galleryMeta = await parseGarrleryMeta(item)
    const imgsMeta = await parseImgMeta(item)

    return {
      title: galleryMeta.title,
      desc: galleryMeta.desc,
      date: galleryMeta.date,
      author: galleryMeta.author,
      imgs: imgsMeta.imgs,
      imgsAndDesc: imgsMeta.imgsAndDesc,
    }
  })

  const galleries = Promise.all(galleriesPromise)
  return galleries
}

export async function getAllPicList() {
  const picList = await parseGallery()

  return picList
}
