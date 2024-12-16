import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import InputMask from 'react-input-mask'

import styles from './AppointmentModal.module.css'

interface AppointmentModalProps {
  show: boolean
  onHide: () => void
  onSubmit: (data: AppointmentFormData) => void
  appointment?: AppointmentFormData
}

export interface AppointmentFormData {
  personalData: {
    fullName: string
    cpf: string
    gender: 'M' | 'F' | 'OTHER'
    birthDate: string
    phone: string
    email: string
  }
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  payment: {
    paymentMethod: 'PIX' | 'BOLETO' | 'DEBITO' | 'CREDITO' | 'DINHEIRO'
    value: number
  }
}

const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, '')

  if (cleanCPF.length !== 11) return false

  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cleanCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cleanCPF.charAt(10))) return false

  return true
}

const validatePhone = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length >= 10 && cleanPhone.length <= 12
}

const validateBirthDate = (date: string) => {
  if (!date) return false

  const parts = date.split('/')
  if (parts.length !== 3) return false

  const day = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1
  const year = parseInt(parts[2])

  const birthDate = new Date(year, month, day)
  const today = new Date()

  return (
    birthDate instanceof Date &&
    !isNaN(birthDate.getTime()) &&
    birthDate < today &&
    day === birthDate.getDate() &&
    month === birthDate.getMonth() &&
    year === birthDate.getFullYear()
  )
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  show,
  onHide,
  onSubmit,
  appointment,
}) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<AppointmentFormData>({
    personalData: {
      fullName: '',
      cpf: '',
      gender: 'M',
      birthDate: '',
      phone: '',
      email: '',
    },
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    payment: {
      paymentMethod: 'PIX',
      value: 0,
    },
  })

  useEffect(() => {
    if (show && appointment) {
      setFormData(appointment)
    } else if (!show) {
      setStep(1)
      setFormData({
        personalData: {
          fullName: '',
          cpf: '',
          gender: 'M',
          birthDate: '',
          phone: '',
          email: '',
        },
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
        },
        payment: {
          paymentMethod: 'PIX',
          value: 0,
        },
      })
    }
  }, [show, appointment])

  const fetchAddressData = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          },
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }

  const handleInputChange = (
    section: keyof AppointmentFormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    handleInputChange('address', 'zipCode', value)
    if (value.length === 8) {
      fetchAddressData(value)
    }
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateStep = () => {
    if (step === 1) {
      const { fullName, cpf, email, phone, birthDate } = formData.personalData
      return (
        fullName.length > 3 &&
        validateCPF(cpf) &&
        validateEmail(email) &&
        validatePhone(phone) &&
        validateBirthDate(birthDate)
      )
    }
    if (step === 2) {
      const { street, number, city, state, zipCode } = formData.address
      return street && number && city && state && zipCode.length === 8
    }
    if (step === 3) {
      return formData.payment.value > 0
    }
    return true
  }

  const renderRequiredLabel = (label: string) => (
    <Form.Label>
      {label} <span className="text-danger">*</span>
    </Form.Label>
  )

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Form.Group className="mb-3">
              {renderRequiredLabel('Nome Completo')}
              <Form.Control
                type="text"
                value={formData.personalData.fullName}
                onChange={(e) =>
                  handleInputChange('personalData', 'fullName', e.target.value)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('CPF')}
              <InputMask
                mask="999.999.999-99"
                value={formData.personalData.cpf}
                onChange={(e) =>
                  handleInputChange('personalData', 'cpf', e.target.value)
                }
              >
                {(inputProps: any) => (
                  <Form.Control
                    {...inputProps}
                    type="text"
                    required
                    isInvalid={
                      formData.personalData.cpf &&
                      !validateCPF(formData.personalData.cpf)
                    }
                  />
                )}
              </InputMask>
              <Form.Control.Feedback type="invalid">
                CPF inválido
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('Sexo')}
              <Form.Select
                value={formData.personalData.gender}
                onChange={(e) =>
                  handleInputChange(
                    'personalData',
                    'gender',
                    e.target.value as 'M' | 'F' | 'OTHER'
                  )
                }
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="OTHER">Outro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('Data de Nascimento')}
              <InputMask
                mask="99/99/9999"
                value={formData.personalData.birthDate}
                onChange={(e) => {
                  const value = e.target.value
                  handleInputChange('personalData', 'birthDate', value)
                }}
                maskPlaceholder={null}
              >
                {(inputProps: any) => (
                  <Form.Control
                    {...inputProps}
                    type="text"
                    required
                    placeholder="DD/MM/AAAA"
                    isInvalid={
                      formData.personalData.birthDate &&
                      formData.personalData.birthDate.replace(/[_/]/g, '')
                        .length === 8 &&
                      !validateBirthDate(formData.personalData.birthDate)
                    }
                  />
                )}
              </InputMask>
              <Form.Control.Feedback type="invalid">
                Data de nascimento inválida
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('Telefone')}
              <InputMask
                mask={
                  formData.personalData.phone.replace(/\D/g, '').length >= 11
                    ? '(99) 99999-9999'
                    : '(99) 9999-99999'
                }
                value={formData.personalData.phone}
                onChange={(e) =>
                  handleInputChange('personalData', 'phone', e.target.value)
                }
                maskPlaceholder={null}
              >
                {(inputProps: any) => (
                  <Form.Control
                    {...inputProps}
                    type="text"
                    required
                    placeholder="(XX) XXXXX-XXXX"
                    isInvalid={
                      formData.personalData.phone &&
                      !validatePhone(formData.personalData.phone)
                    }
                  />
                )}
              </InputMask>
              <Form.Control.Feedback type="invalid">
                Telefone inválido. Digite DDD + número (8-10 dígitos)
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('E-mail')}
              <Form.Control
                type="email"
                value={formData.personalData.email}
                onChange={(e) =>
                  handleInputChange('personalData', 'email', e.target.value)
                }
                required
                isInvalid={
                  formData.personalData.email &&
                  !validateEmail(formData.personalData.email)
                }
              />
              <Form.Control.Feedback type="invalid">
                E-mail inválido
              </Form.Control.Feedback>
            </Form.Group>
          </>
        )

      case 2:
        return (
          <>
            <Form.Group className="mb-3">
              {renderRequiredLabel('CEP')}
              <InputMask
                mask="99999-999"
                value={formData.address.zipCode}
                onChange={handleZipCodeChange}
              >
                {(inputProps: any) => (
                  <Form.Control {...inputProps} type="text" required />
                )}
              </InputMask>
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('Logradouro')}
              <Form.Control
                type="text"
                value={formData.address.street}
                onChange={(e) =>
                  handleInputChange('address', 'street', e.target.value)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('Número')}
              <Form.Control
                type="text"
                value={formData.address.number}
                onChange={(e) =>
                  handleInputChange('address', 'number', e.target.value)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Complemento</Form.Label>
              <Form.Control
                type="text"
                value={formData.address.complement}
                onChange={(e) =>
                  handleInputChange('address', 'complement', e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('Bairro')}
              <Form.Control
                type="text"
                value={formData.address.neighborhood}
                onChange={(e) =>
                  handleInputChange('address', 'neighborhood', e.target.value)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('Cidade')}
              <Form.Control
                type="text"
                value={formData.address.city}
                onChange={(e) =>
                  handleInputChange('address', 'city', e.target.value)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('Estado')}
              <Form.Control
                type="text"
                value={formData.address.state}
                onChange={(e) =>
                  handleInputChange('address', 'state', e.target.value)
                }
                required
              />
            </Form.Group>
          </>
        )

      case 3:
        return (
          <>
            <Form.Group className="mb-3">
              {renderRequiredLabel('Método de Pagamento')}
              <Form.Select
                value={formData.payment.paymentMethod}
                onChange={(e) =>
                  handleInputChange('payment', 'paymentMethod', e.target.value)
                }
                required
              >
                <option value="PIX">PIX</option>
                <option value="BOLETO">Boleto</option>
                <option value="DEBITO">Débito</option>
                <option value="CREDITO">Crédito</option>
                <option value="DINHEIRO">Dinheiro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              {renderRequiredLabel('Valor (R$)')}
              <Form.Control
                type="text"
                value={
                  formData.payment.value
                    ? formatCurrency(formData.payment.value)
                    : ''
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  const numberValue = value ? Number(value) / 100 : 0
                  handleInputChange('payment', 'value', numberValue.toString())
                }}
                required
                isInvalid={formData.payment.value <= 0}
              />
              <Form.Control.Feedback type="invalid">
                O valor deve ser maior que zero
              </Form.Control.Feedback>
            </Form.Group>
          </>
        )

      default:
        return null
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      onSubmit(formData)
      setStep(1)
      onHide()
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      dialogClassName={styles['modal-90w']}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {appointment ? 'Editar Consulta' : 'Agendar Consulta'} - Etapa {step}{' '}
          de 3
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>{renderStep()}</Modal.Body>
        <Modal.Footer>
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Voltar
            </Button>
          )}
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={!validateStep()}>
            {step === 3 ? 'Confirmar Agendamento' : 'Próximo'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AppointmentModal
