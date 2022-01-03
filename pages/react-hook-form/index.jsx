import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const state = ['SP', 'MG', 'LA', 'RJ']

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  email: yup
    .string()
    .required('O campo email é obrigatório')
    .email('o email não é válido'),
  uf: yup.string().required('selecione um estado').max(2),
  subscribe: yup.boolean(),
})

const HookForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const onSubmit = async (values) => {
    const data = await fetch('api/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(values),
    })
  }

  useEffect(() => {
    const dataLoad = async () => {
      const data = await fetch('api/users/3')
      const json = await data.json()
      setValue('name', json.name)
      setValue('email', json.email)
      setValue('uf', json.uf)
      setValue('subscribe', json.subscribe)
    }
    dataLoad()
  }, [])

  return (
    <div className="skin">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>React Hook Form</h1>
        <input type="text" {...register('name')} placeholder="name" />
        {errors.name?.message && <span>{errors.name.message}</span>}

        <input type="text" {...register('email')} placeholder="email" />
        {errors.email?.message && <span>{errors.email.message}</span>}

        <select {...register('uf')}>
          <option value="">Estado...</option>
          {state.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>
        {errors.uf?.message && <span>{errors.uf.message}</span>}
        <br />
        <input type="checkbox" {...register('subscribe')} />
        {errors.subscribe?.message && <span>{errors.subscribe.message}</span>}
        <br />
        <button type="submit">Enviar</button>
        {console.log(errors)}
      </form>
    </div>
  )
}

export default HookForm
