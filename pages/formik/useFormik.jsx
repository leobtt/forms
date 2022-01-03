import * as yup from 'yup'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'

const state = ['SP', 'MG', 'LA', 'RJ']

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  email: yup
    .string()
    .required('O campo email é obrigatório')
    .email('O email não é válido'),
  uf: yup.string().required('Selecione um estado').max(2),
  subscribe: yup.boolean(),
})

const UseFormik = () => {
  const form = useFormik({
    initialValues: {
      name: '',
      email: '',
      uf: '',
      subscribe: false,
    },
    onSubmit: async (values) => {
      const data = await fetch('/api/users', {
        method: 'POST',
        headers: {
          Accpet: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(values),
      })
    },
    validationSchema: schema,
  })
  const { handleChange, handleBlur, values, errors, touched, setFieldValue } =
    form

  useEffect(() => {
    const loadData = async () => {
      const data = await fetch('/api/users/2')
      const json = await data.json()
      setFieldValue('name', json.name)
      setFieldValue('email', json.email)
      setFieldValue('uf', json.uf)
      setFieldValue('subscribe', json.subscribe)
    }
    loadData()
  }, [])

  return (
    <div className="skin">
      <form onSubmit={form.handleSubmit}>
        <h1>useFormik</h1>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="nome"
        />
        {errors.name && touched.name && <span>{errors.name}</span>}

        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="email"
        />
        {errors.email && touched.email && <span>{errors.email}</span>}

        <select
          name="uf"
          value={values.uf}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Estado...</option>
          {state.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>

        {errors.uf && touched.uf && <span>{errors.uf}</span>}
        <input
          type="checkbox"
          name="subscribe"
          onChange={handleChange}
          checked={values.subscribe}
        />
        <br />
        <button type="submit">Enviar dados</button>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </form>
    </div>
  )
}

export default UseFormik
