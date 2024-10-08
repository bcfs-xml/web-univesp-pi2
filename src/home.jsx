import { Link } from "react-router-dom";
import ImagePadua from './assets/image_padua.svg'

export function Home() {
  return (

    <main className="h-full flex items-center justify-center max-w-[1000px] m-auto">
      <section className="flex flex-col gap-8">
        <h1 className="text-4xl">Organize seu estoque de maneira <span className="font-bold">fácil</span> e <span className="font-bold">rápida</span>.</h1>
        <Link to="dashboard" className="bg-[#019C87] h-14 text-white text-2xl font-bold w-56 text-center flex items-center justify-center rounded-xl transition-opacity hover:opacity-90">
          Entrar
        </Link>
      </section>

      <section>
        <img src={ImagePadua} alt="Imagem Controle de estoque" />
      </section>
    </main>

  )
}