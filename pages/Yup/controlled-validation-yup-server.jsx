import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import * as yup from 'yup'

const state = ['MG', 'SP', 'PI', 'RJ', 'LA']

export default function Controlled() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    uf: '',
    subscribe: false,
  })
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [sending, setSending] = useState(false)

  const schema = yup.object().shape({
    name: yup.string().required('O campo nome é obrigatório'),
    email: yup
      .string()
      .required('O campo e-mail é obrigatório')
      .email('O e-mail deve ser válido'),
  })

  useEffect(() => {
    const validation = async () => {
      const hasError = await schema.isValid(form)
      setHasError(hasError)
      try {
        await schema.validate(form, { abortEarly: false })
        setError({})
      } catch (err) {
        const errors = err.inner.reduce(
          (prev, curr) => ({ ...prev, [curr.path]: curr.message }),
          {}
        )
        setError(errors)
      }
    }
    validation()
  }, [form])

  useEffect(() => {
    const loadData = async () => {
      const data = await fetch('/api/users/2')
      const json = await data.json()
      setForm(json)
      setLoaded({
        name: json.name,
        email: json.email,
        uf: json.uf,
        subscribe: json.subscribe,
      })
    }
    loadData()
  }, [])

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

  const save = async () => {
    setSending(true)
    try {
      const data = await fetch('/api/users', {
        method: 'POST',
        headers: {
          // tipo de conteúdo que eu aceito de volta
          Accept: 'application/json',
          // Qual tipo de conteúdo estou enviando
          'Content-type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      const json = await data.json()
      console.log(JSON.stringify(json, null, 2))
      setSending(false)
    } catch (err) {
      setSending(false)
    }
  }

  return (
    <div className="skin">
      <form>
        <h1>Formulário controlado - validação com Yup</h1>
        <p>Dados validados: {JSON.stringify(hasError)}</p>
        {!loaded && <h2>Carrengado dados...</h2>}
        {loaded && (
          <>
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="nome"
              onChange={getValue}
            />
            {error.name && <span>{error.name}</span>}
            <input
              type="text"
              name="email"
              value={form.email}
              placeholder="email"
              onChange={getValue}
            />
            {error.email && <span>{error.email}</span>}
            <br />
            <select value={form.uf} name="uf" onChange={getValue}>
              {state.map((uf) => {
                return (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                )
              })}
            </select>
            <br />

            <label>
              <input
                type="checkbox"
                name="subscribe"
                checked={form.subscribe}
                onChange={getValue}
              />
              Deseja recever novidades por e-mail
            </label>
            <br />
            <button type="button" onClick={save} disabled={sending}>
              Salvar
            </button>
            <br />
            <pre>{JSON.stringify(form, null, 2)}</pre>
          </>
        )}
      </form>
    </div>
  )
}
