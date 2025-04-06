import { Header } from "./components/header";
import * as Dialog from "@radix-ui/react-dialog";
import { Modal } from "./components/modal";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "./services/api";
import { Input } from "./components/input";
import { Trash2 } from "lucide-react";
import { Loading } from "./components/loading";
import { Link } from "react-router-dom";


export function Orders() {
  const [openModalNewDesk, setOpenModalNewDesk] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [listDesks, setListDesks] = useState([])



  const schema = yup.object().shape({
    mesa: yup.number().required(),
    pedido: yup.string().required(),
  });

  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  function handleSubmitDesk(data) {

    const newDesk = {
      nome: data.pedido,
      quantidade: data.mesa,
      preco: 9999
    }

    setIsLoading(true)
    api.post(`/adicionar_item`, newDesk)
      .then(() => {
        toast.success('Mesa cadastrada com sucesso')
        setOpenModalNewDesk(false)
        handleGetDesks()

      })
      .catch(() => {
        toast.error('Ocorreu um erro ao cadastrar mesa!')
      })
      .finally(() => setIsLoading(false))
  }

  function handleGetDesks() {


    setIsLoading(true)
    api.get('/').then((resp) => {

      const desks = resp.data.filter(desk => desk.preco === 9999)

      setListDesks(desks)

    })
      .finally(() => setIsLoading(false))
  }

  function handleDeleteItem(id) {

    api.delete(`/excluir/${id}`)
      .then(() => {
        toast.success('Mesa deletado com sucesso!')
        handleGetDesks()
      })
      .catch(() => toast.error('Ocorreu um erro ao deletar item!'))
  }

  useEffect(() => {
    handleGetDesks()
  }, [])

  return (
    <div>
      <Header />

      <div className=" m-auto max-w-[1000px]  justify-center mt-8">
        <div className="flex flex-col w-full items-center gap-8">
          <div className='w-full flex items-center justify-between'>
            <h1 className="font-bold text-4xl">PEDIDOS</h1>
            <Link to="/dashboard" className="bg-transparent border border-[#019C87]  h-10 text-[#019C87] px-6 text-xl py-4 font-bold text-center flex items-center justify-center rounded-xl transition-opacity hover:opacity-90">
              Estoque
            </Link>
          </div>

          <div className="h-0.5 bg-slate-500 w-full" />

          <div className="w-full flex justify-end mt-8">
            <button onClick={() => { reset(); setOpenModalNewDesk(true) }} className="bg-[#019C87] h-12 text-white text-xl font-bold w-48 text-center flex items-center justify-center rounded-xl transition-opacity hover:opacity-90 ">Adicionar mesa</button>
          </div>

          {loading && (
            <Loading />
          )}

          {!loading && listDesks && listDesks.length === 0 && (
            <h1 className="text-center mt-16 text-3xl">Não há pedidos cadastrados</h1>
          )}

          {!loading && (
            <div className="w-full flex gap-4 flex-wrap">

              {listDesks.map(desk => (
                <div key={desk.id} className="w-[220px] bg-white min-h-[200px] rounded-lg p-4 gap-4">
                  <div className="w-full flex justify-between items-center">
                    <h1 className="font-semibold text-xl">{`MESA - ${desk.quantidade}`}</h1>
                    <Trash2 className="text-red-500 cursor-pointer" onClick={() => { handleDeleteItem(desk.id) }} />
                  </div>

                  <div className="mt-2 flex flex-col gap-2 w-full  break-words">
                    <h1 className="font-semibold text-xl text-zinc-500">Pedidos:</h1>

                    <p>{desk.nome}</p>
                  </div>
                </div>
              ))}

            </div>
          )}




        </div>
      </div>

      <Dialog.Root open={openModalNewDesk} onOpenChange={() => setOpenModalNewDesk(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-dialog max-w-[450px] max-h-[85vh] w-[90vw] p-6">
            <form onSubmit={handleSubmit(handleSubmitDesk)} className="text-center flex flex-col gap-12">
              <h1 className="text-2xl font-bold">Adicionar nova mesa de pedido</h1>

              <div className="flex flex-col gap-3">
                <Controller
                  control={control}
                  name="mesa"
                  render={({ field }) => (
                    <Input type="number" value={field.value} onChange={field.onChange} placeHolder="Digite o numero da mesa" error={Boolean(errors.mesa)} />
                  )}
                />

                <Controller
                  control={control}
                  name="pedido"
                  render={({ field }) => (
                    <Input type="text" value={field.value} onChange={field.onChange} placeHolder="Digite o pedido" error={Boolean(errors.pedido)} />
                  )}
                />


              </div>

              <div className="flex items-center justify-end gap-2">
                <button disabled={loading} type="submit" className="bg-[#019C87] h-10 text-white text-xl p-4 font-bold  text-center flex items-center justify-center rounded-xl transition-opacity hover:opacity-90 ">Confirmar</button>
                <Dialog.Close asChild>
                  <button className="bg-[transparent] border-2 border-[#71717A] h-10 text-[#71717A] text-xl font-bold p-4  text-center flex items-center justify-center rounded-xl transition-opacity hover:opacity-90 ">Cancelar</button>
                </Dialog.Close>

              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
        <Modal />
      </Dialog.Root>
    </div>
  )
}