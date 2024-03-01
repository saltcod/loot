import Link from 'next/link'

interface Props {
  word: string
}

function WordLink({ word }: Props) {
  return (
    <Link href={`/search?q=${word.toLowerCase()}`} className="hover:underline">
      {word}
    </Link>
  )
}

export default WordLink
