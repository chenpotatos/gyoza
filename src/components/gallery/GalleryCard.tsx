interface GalleryCardProps {
  title: string
  desc: string
  date: string
  imgs: string[]
  author?: string
  onClick: Function
}

export function GalleryCard(props: GalleryCardProps) {
  const { author, title, desc, date, imgs, onClick } = props

  if (imgs.length === 0) {
    throw new Error('img list must have one value')
  }

  return (
    <section
      className="bg-card rounded-xl pb-48 relative h-full w-full image-hover sm:pb-32 cursor-pointer"
      onClick={() => onClick()}
    >
      <h3 className="absolute right-2 bottom-2 text-[3rem] text-transparent leading-none font-bold pointer-events-none select-none font-['Atkinson'] whitespace-nowrap textStroke">
        {author}
      </h3>
      <div className="w-28 h-28 relative left-4 top-4 sm:w-32 sm:h-44 flex justify-center">
        {imgs[2] && (
          <img
            src={imgs[2]}
            alt=""
            className="w-28 border-4 border-white absolute translate-x-44 rotate-12 rounded-xl hover:z-10 hover:rotate-0 transition-all ease-out sm:w-32 sm:translate-x-36"
          />
        )}

        {imgs[1] && (
          <img
            src={imgs[1]}
            alt=""
            className="w-28 border-4 border-white absolute translate-x-20 rotate-12 rounded-xl hover:z-10 hover:rotate-0 transition-all ease-out sm:w-32"
          />
        )}

        {imgs[0] && (
          <img
            src={imgs[0]}
            alt=""
            className="w-28 border-4 border-white absolute -rotate-12 rounded-xl sm:w-32 hover:z-10 hover:rotate-0 transition-all ease-out"
          />
        )}
      </div>

      <div className="absolute bottom-4 left-4">
        {/* <!-- title --> */}
        <p className="font-bold text-lg">{title}</p>

        {/* <!-- desc --> */}
        <p className="text-sm">{desc}</p>
        <p className="text-sm">{date}</p>
      </div>
    </section>
  )
}
