import React, { useEffect, useState } from 'react'
import { Form, FormItemProps, message, Input } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import service from './service'
import { ConfigEntity } from './data'
import styles from './styles'

type Schema<T = Record<string, any>> = {
  dataIndex: string
  title: string
  renderField: React.FC<{
    form: {
      setValue(val: Partial<T>): void
      getValue(key?: keyof T): Partial<T> | any
    }
  }>
}

const configColumns: Schema<ConfigEntity>[] = [
  {
    dataIndex: 'localFolder',
    title: '存储目录',
    renderField: ({ form }) => {
      const descValue = form.getValue('localFolder')

      const [editable, setEditable] = useState<boolean>(false)
      const [value, setValue] = useState<string>()

      useEffect(() => {
        setValue(descValue)
      }, [descValue])

      if (editable) {
        return (
          <div style={styles.field}>
            <Input
              value={value}
              disabled={!editable}
              onChange={(e) => setValue(e.target.value)}
            />
            <CheckOutlined
              size={16}
              style={styles.icon}
              onClick={async () => {
                await service.updateConfig('localFolder', value)
                form.setValue({
                  localFolder: value,
                })
                message.success('编辑成功')
                setEditable(false)
              }}
            />
            <CloseOutlined
              size={16}
              style={styles.icon}
              onClick={() => setEditable(false)}
            />
          </div>
        )
      } else {
        return (
          <div style={styles.field}>
            <div style={{ flex: 1 }}>{descValue}</div>
            <EditOutlined
              size={16}
              style={styles.icon}
              onClick={() => setEditable(true)}
            />
          </div>
        )
      }
    },
  },
  {
    dataIndex: 'host',
    title: '当前主机',
    renderField: ({ form }) => {
      const value = form.getValue('host')
      return <div>{value}</div>
    },
  },
]

const Config: React.FC = () => {
  const [formdata, setFormdata] = useState<Partial<ConfigEntity>>({})

  useEffect(() => {
    service.getConfig().then(setFormdata)
  }, [])

  return (
    <Form>
      {configColumns.map((column) => {
        const { dataIndex, title, renderField: RF } = column
        return (
          <Form.Item key={dataIndex} name={dataIndex} label={title}>
            <RF
              form={{
                setValue: (val: Partial<ConfigEntity>) => {
                  setFormdata({
                    ...formdata,
                    ...val,
                  })
                },
                getValue: (key) => (key ? formdata[key] : formdata),
              }}
            />
          </Form.Item>
        )
      })}
    </Form>
  )
}

export default Config
