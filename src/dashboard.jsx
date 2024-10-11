import { Trash2 } from "lucide-react";
import { Header } from "./components/header";
import { useEffect, useState } from "react";
import { api } from "./services/api";
import { Loading } from "./components/loading";
import * as Dialog from "@radix-ui/react-dialog";
import { Modal } from "./components/modal";
import { toast } from "react-toastify";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./components/input";
import { Table } from "@radix-ui/themes";

export function Dashboard() {
  const [loading, setIsLoading] = useState(false)
  const [list, setList] = useState([])
  const [qtd, setQtd] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [indexDelete, setIndexDelete] = useState()

  const [openModalNewItem, setOpenModalNewItem] = useState(false)

  const defaultValues = {
    nome: '',
    quantidade: '',
    preco: ''
  }

  const schema = yup.object().shape({
    nome: yup.string().required(),
    quantidade: yup.number().required(),
    preco: yup.number().required(),
  });

  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });


  function handleDeleteItem() {
    let qtdList = 0
    let qtdValue = 0

    api.delete(`/excluir/${indexDelete}`)
      .then(() => {
        toast.success('Item deletado com sucesso!')
        setOpenModalDelete(false)
        const array = list.filter((item) => item.id !== indexDelete)
        setList(array)
        array.forEach(item => {
          qtdList += item.quantidade
          qtdValue += item.preco * item.quantidade
        })

        setQtd(qtdList)
        setTotalValue(qtdValue)
      })
      .catch(() => toast.error('Ocorreu um erro ao deletar item!'))
  }

  function handleGetItems() {
    let qtdList = 0
    let qtdValue = 0

    setIsLoading(true)
    api.get('/').then((resp) => {
      setList(resp.data)
      resp.data.forEach(item => {
        qtdList += item.quantidade
        qtdValue += item.preco * item.quantidade
      })
      setQtd(qtdList)
      setTotalValue(qtdValue)

    })
      .finally(() => setIsLoading(false))
  }

  function handleSubmitItem(data) {
    setIsLoading(true)
    api.post(`/adicionar_item`, data)
      .then(() => {
        toast.success('Item cadastrado com sucesso')
        setOpenModalNewItem(false)
        handleGetItems()
      })
      .catch(() => {
        toast.error('Ocorreu um erro ao cadastrar item!')
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    handleGetItems()
  }, [])

  return (
    <>
      <Header />

      <div className=" m-auto max-w-[1000px]  justify-center mt-8">
        <div className="flex flex-col w-full items-center gap-8">
          <h1 className="font-bold text-4xl">ESTOQUE PÁDUA</h1>

          <div className="h-0.5 bg-slate-500 w-full" />
        </div>

        <div className="w-full flex justify-end mt-8">
          <button onClick={() => { reset(); setOpenModalNewItem(true) }} className="bg-[#019C87] h-12 text-white text-2xl font-bold w-48 text-center flex items-center justify-center rounded-xl transition-opacity hover:opacity-90 ">Adicionar</button>
        </div>






        {loading && (
          <Loading />
        )}

        {!loading && list && list.length === 0 && (
          <h1 className="text-center mt-16 text-3xl">Não há dados cadastrados</h1>
        )}

        {!loading && list && list.length > 0 && (
          <>
            <Table.Root className="mt-10">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantidade</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Preço (unitário)</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body className="!mt-4">
                {list.map(item => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="py-2">{item.nome}</Table.Cell>
                    <Table.Cell className="py-2">{item.quantidade}</Table.Cell>
                    <Table.Cell className="py-2">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}</Table.Cell>
                    <Table.Cell className="py-2"> <Trash2 className="text-red-500 cursor-pointer" onClick={() => { setIndexDelete(item.id); setOpenModalDelete(true) }} /> </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>

            </Table.Root>


            <div className="w-full flex items-center gap-8 justify-end mt-8">
              <p className="text-2xl">Quantidade total: <span className="font-bold">{qtd}</span></p>
              <p className="text-2xl">Valor total:
                <span className="font-bold">
                  {' '}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                </span>
              </p>
            </div>

          </>
        )}

      </div>

      <Dialog.Root open={openModalDelete} onOpenChange={() => setOpenModalDelete(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-dialog max-w-[450px] max-h-[85vh] w-[90vw] p-6">
            <div className="text-center flex flex-col gap-12">
              <h1 className="text-2xl font-bold">Deseja deletar item ?</h1>

              <div className="flex items-center justify-end gap-2">
                <button onClick={handleDeleteItem} className="bg-[#019C87] h-10 text-white text-xl p-4 font-bold  text-center flex items-center justify-center rounded-xl transition-opacity hover:opacity-90 ">Confirmar</button>
                <Dialog.Close asChild>
                  <button className="bg-[transparent] border-2 border-[#71717A] h-10 text-[#71717A] text-xl font-bold p-4  text-center flex items-center justify-center rounded-xl transition-opacity hover:opacity-90 ">Cancelar</button>
                </Dialog.Close>

              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
        <Modal />
      </Dialog.Root>


      <Dialog.Root open={openModalNewItem} onOpenChange={() => setOpenModalNewItem(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-dialog max-w-[450px] max-h-[85vh] w-[90vw] p-6">
            <form onSubmit={handleSubmit(handleSubmitItem)} className="text-center flex flex-col gap-12">
              <h1 className="text-2xl font-bold">Adicionar novo item</h1>

              <div className="flex flex-col gap-3">
                <Controller
                  control={control}
                  name="nome"
                  render={({ field }) => (
                    <Input type="text" value={field.value} onChange={field.onChange} placeHolder="Digite o nome" error={Boolean(errors.nome)} />
                  )}
                />

                <Controller
                  control={control}
                  name="quantidade"
                  render={({ field }) => (
                    <Input type="number" value={field.value} onChange={field.onChange} placeHolder="Digite a quantidade" error={Boolean(errors.quantidade)} />
                  )}
                />

                <Controller
                  control={control}
                  name="preco"
                  render={({ field }) => (
                    <Input type="number" value={field.value} onChange={field.onChange} placeHolder="Digite o preço (unitário)" error={Boolean(errors.preco)} />
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
    </>
  )
}