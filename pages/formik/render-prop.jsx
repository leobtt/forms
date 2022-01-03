import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import { useEffect } from 'react'

const state = ['MG', 'SP', 'PI', 'RJ', 'LA']

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório'),
  email: yup
    .string()
    .required('O campo email é obrigatório')
    .email('O email não é válido'),
  uf: yup.string().required('o campo estado é obrigatório').max(2),
  subscribe: yup.boolean(),
})

const FormFormik = () => {
  return (
    <div className="skin">
      <Formik
        initialValues={{
          name: '',
          email: '',
          uf: '',
          subscribe: false,
        }}
        onSubmit={async (values) => {
          const data = await fetch('/api/users', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-type': 'application/json',
            },
            body: JSON.stringify(values),
          })
          const json = await data.json()
        }}
        validationSchema={schema}
      >
        {({ values, errors, touched, setFieldValue }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            const loadData = async () => {
              const data = await fetch('/api/users/3')
              const json = await data.json()
              setFieldValue('name', json.name)
              setFieldValue('email', json.email)
              setFieldValue('uf', json.uf)
              setFieldValue('subscribe', json.subscribe)
            }
            loadData()
          }, [])

          return (
            <Form>
              <h1>Formik Render Prop</h1>
              <Field type="text" name="name" placeholder="name" />
              <br />
              {errors.name && touched.name && (
                <span>
                  {errors.name}
                  <br />
                </span>
              )}
              <Field type="text" name="email" placeholder="e-mail" />
              <br />
              {errors.email && touched.email && (
                <span>
                  {errors.email}
                  <br />
                </span>
              )}
              <Field component="select" name="uf">
                {state.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </Field>
              <br />
              <label>
                <Field type="checkbox" name="subscribe" />
                Desejar receber notícias
              </label>
              <br />
              <button type="submit">Enviar formulário</button>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default FormFormik
