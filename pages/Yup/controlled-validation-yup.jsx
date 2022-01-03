import { useEffect, useState } from 'react'
import * as yup from 'yup'

const state = ['MG', 'SP', 'PI', 'RJ']

export default function Controlled() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    estado: '',
    check: false,
  })
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState({})

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

  const schema = yup.object().shape({
    name: yup.string().required('O campo nome é obrigatório'),
    email: yup
      .string()
      .required('O campo e-mail é obrigatório')
      .email('O e-mail deve ser válido'),
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

  const save = () => {}

  return (
    <div className="skin">
      <form>
        <h1>Formulário controlado - validação com Yup</h1>
        <input type="text" name="name" placeholder="nome" onChange={getValue} />
        {<span>{error.name}</span>}
        <input
          type="text"
          name="email"
          placeholder="email"
          onChange={getValue}
        />
        {<span>{error.email}</span>}
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

        <label>
          <input type="checkbox" name="check" onChange={getValue} />
          Deseja recever novidades por e-mail
        </label>
        <br />
        <button type="button" onClick={save}>
          Salvar
        </button>
        <br />
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </form>
    </div>
  )
}
