import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

const state = ['MG', 'SP', 'PI', 'RJ']

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    estado: '',
    check: false,
  })

  const getValue = (evt) => {
    const formField = evt.target.name
    const value =
      evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value
    setForm((curr) => {
      return {
        ...curr,
        [formField]: value,
      }
    })
  }

  const save = () => {
    console.log(form)
  }

  const errors = {
    name: false,
    email: false,
  }

  // erro por campo
  if (form.name === '') errors.name = true
  if (form.email === '') errors.email = true

  // variável que se há algum erro = true
  const hasError = Object.keys(errors).reduce(
    (prev, curr) => prev || errors[curr],
    false
  )
  console.log(hasError)

  return (
    <div className="skin">
      <form>
        <h1>Formulário tem um erro: {JSON.stringify(hasError)}</h1>
        <input type="text" name="name" placeholder="nome" onChange={getValue} />
        {errors.name === true && <span>valor incorreto</span>}
        <input
          type="text"
          name="email"
          placeholder="email"
          onChange={getValue}
        />
        {errors.email === true && <span>valor incorreto</span>}
        <br />
        <select value={form.estado} name="estado" onChange={getValue}>
          {state.map((uf) => {
            return (
              <option key={uf} value={uf}>
                {uf}
              </option>
            )
          })}
        </select>
        <br />
        <label htmlFor="check">
          <input type="checkbox" name="check" onChange={getValue} />
          Deseja receber notícias
        </label>
        <button type="button" onClick={save}>
          Salvar
        </button>
        <br />
      </form>
    </div>
  )
}
