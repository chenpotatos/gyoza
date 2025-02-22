export function RandomText(props: { sentences: string[][]; total: number }) {
  function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const { sentences, total } = props

  const rand = getRndInteger(0, total - 1)

  return (
    <>
      <section>
        <p>{sentences[rand][0]}</p>
        <p>{sentences[rand][1]}</p>
      </section>
    </>
  )
}
