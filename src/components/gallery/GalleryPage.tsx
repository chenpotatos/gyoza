import { useEffect, useRef, useState } from 'react'
import { GalleryCard } from './GalleryCard'
import { useDrag } from '@use-gesture/react'
import { useSprings, animated } from '@react-spring/web'
import { clamp, set } from 'lodash'

interface GalleryProps {
  list: {
    title: string
    desc: string
    date: string
    author: string
    imgs: string[]
    imgsAndDesc: {
      img: string
      desc: string
    }[]
  }[]
}

export function GalleryPage(GalleryProps: GalleryProps) {
  const { list } = GalleryProps

  const imgIndexRef = useRef(0)
  const [imgIndex, setImhIndex] = useState(0)
  const width = window.innerWidth

  const [currentImgs, setCurrentImgs] = useState<string[]>([])
  const [curGroupId, setCurGroupId] = useState<number | null>(0)

  const onShowImgs = (imgs: string[], groupid: number) => {
    setCurrentImgs(imgs)
    setCurGroupId(groupid)
    setImhIndex(0)
  }

  const hideImgs = () => {
    setCurrentImgs([])
    setCurGroupId(null)
  }

  const [imgCardPprops, api] = useSprings(currentImgs.length, (i) => ({
    x: i * width,
    scale: 1,
    barX: 1,
    display: 'block',
  }))
  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (active && Math.abs(mx) > width / 2) {
      const drawImgIndex = clamp(
        imgIndexRef.current + (xDir > 0 ? -1 : 1),
        0,
        currentImgs.length - 1,
      )
      imgIndexRef.current = drawImgIndex

      setImhIndex(drawImgIndex)
      cancel()
    }
    api.start((i) => {
      if (i < imgIndexRef.current - 1 || i > imgIndexRef.current + 1) return { display: 'none' }
      const x = (i - imgIndexRef.current) * width + (active ? mx : 0)
      const barX = (i - imgIndexRef.current) * width - (active ? mx : 0)
      const scale = active ? 1 - Math.abs(mx) / width / 2 : 1
      return { x, scale, display: 'block', barX }
    })
  })

  return (
    <>
      <div
        className={`grid-cols-1 sm:grid-cols-2 auto-rows-auto grid gap-5 overflow-hidden ${currentImgs.length > 0 ? 'h-[100vh]' : ''}`}
      >
        {list.map((item, index) => (
          <GalleryCard
            key={`gallery${index}`}
            title={item.title}
            author={item.author}
            desc={item.desc}
            date={item.date}
            imgs={item.imgs}
            onClick={() => onShowImgs(item.imgs, index)}
          />
        ))}
      </div>

      <section
        className={`w-full min-h-[100vh] fixed top-0 left-0 bg-black z-100 overflow-hidden transition-transform ease-in-out duration-300 z-20 ${currentImgs.length > 0 ? 'translate-y-0 h-[100vh] overflow-hidden' : '-translate-y-full'}`}
      >
        <div className="h-[64px] relative bg-primary"></div>

        <div className="w-full absolute top-[64px] z-30 flex justify-center items-center">
          <div className="w-full flex justify-center items-center z-30 xl:max-w-[500px]">
            <p className="ml-14 w-full text-center">
              {curGroupId !== null && list[curGroupId].title}
            </p>
            <i
              className="iconfont icon-close text-3xl mr-8 lg:mr-0 cursor-pointer hover:scale-125"
              onClick={() => {
                hideImgs()
              }}
            ></i>
          </div>
        </div>

        <div
          style={{
            height: 'calc(100vh - 64px)',
          }}
          className="w-full relative bg-primary"
        >
          {imgCardPprops.map(({ x, scale }, i) => {
            return (
              <animated.div
                className=" fixed top-0 left-0 w-full h-[100%] touch-none flex justify-center items-center flex-col"
                {...bind()}
                key={i}
                style={{ x }}
              >
                <animated.div
                  className="touch-none bg-cover bg-no-repeat object-center bg-center rounded-lg w-[95%] h-[60%] xl:h-[70%] xl:w-[500px]"
                  style={{
                    scale,
                    backgroundImage: `url(${list[curGroupId ?? 0].imgs[i]})`,
                  }}
                />

                <div>{curGroupId !== null && list[curGroupId].imgsAndDesc[i].desc}</div>
              </animated.div>
            )
          })}

          <div className="flex w-full h-1 absolute bottom-5 justify-center">
            {imgCardPprops.map(({ barX }, i) => {
              return (
                <animated.div
                  className={`w-full  h-1 ${imgIndex == i ? 'bg-slate-500' : 'bg-transparent'}  lg:max-w-[250px]`}
                  {...bind()}
                  key={i}
                  style={{ x: barX }}
                ></animated.div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
