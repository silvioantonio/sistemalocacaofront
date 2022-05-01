import React, { useState, useEffect } from 'react';

import { Alert, Button, Form, Input, Space, Table, notification } from 'antd';

import Header from '../Header';

import { Wrapper, Content } from './styles';
import api from '../../services/api';
import { Client } from '../../types/client';
import moment from 'moment';

const Home: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [visible, setVisible] = useState(false);
    const [edit, setEdit] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf',
        },
        {
            title: 'Data de Aniversario',
            dataIndex: 'birthDate',
            render: (value: Date) => moment(value).format('DD/MM/YYYY'),
            key: 'birthDate',
        },
        {
            key: 'action',
            render: (record: any) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Editar
                    </Button>
                    <Button type="primary" danger onClick={() => handleDelete(record)}>
                        Deletar
                    </Button>
                </Space>
            ),
        },
    ];

    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
    };

    const buttonItemLayout = {
        wrapperCol: { span: 14, offset: 8 },
    };

    const openNotification = (placement: string, type: string) => {
        switch (type) {
            case 'success':
                notification.success({
                    message: `O cliente ${placement} foi deletado do sistema!`,
                });
                break;
            case 'error':
                notification.error({
                    message: `Houve um erro e o cliente ${placement} não foi deletado do sistema!`,
                });
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        async function loadClients() {
            const response = await api.get<Client[]>('client');
            setClients(response.data);
        }
        loadClients();
    }, []);

    function handleEdit(data: any) {
        setEdit(true);
        form.setFieldsValue(data);
    }

    async function handleDelete(data: any) {
        await api
            .delete('client/' + data.id)
            .then(() => {
                const response = clients.filter((obj) => {
                    return obj.Id != data.id;
                });
                setClients(response);
                openNotification(data.name, 'success');
            })
            .catch(() => {
                openNotification(data.name, 'error');
            });
    }

    async function handleSubmit(data: any) {
        if (data.cpf.length !== 11) {
            setVisible(true);
            setErrorMessage('CPF invalido');
            setTimeout(() => {
                setVisible(false);
            }, 5000);
        }

        if (!data.id) {
            await api
                .post('client', {
                    Name: data.name,
                    CPF: data.cpf,
                    BirthDate: data.birthDate,
                })
                .then(function (response) {
                    form.resetFields();
                    setClients((x) => [...x, response.data as Client]);
                    notification.success({
                        message: `O cliente ${response.data.name} foi cadastrado do sistema!`,
                    });
                })
                .catch(function () {
                    setVisible(true);
                    setErrorMessage('Erro ao cadastrar cliente, confira os dados!');
                    setTimeout(() => {
                        setVisible(false);
                    }, 5000);
                });
        } else {
            await api
                .put('client', {
                    Id: data.id,
                    Name: data.name,
                    CPF: data.cpf,
                    BirthDate: data.birthDate,
                })
                .then(function (response) {
                    form.resetFields();
                    notification.success({
                        message: `O cliente ${response.data.name} foi editado no sistema!`,
                    });
                })
                .catch(function () {
                    setVisible(true);
                    setErrorMessage('Erro ao editar cliente, confira os dados!');
                    setTimeout(() => {
                        setVisible(false);
                    }, 5000);
                });
            setEdit(false);
        }
    }

    return (
        <Wrapper>
            <Header />
            {visible ? <Alert message={errorMessage} type="error" showIcon closable /> : null}
            <Content>
                <Form form={form} {...formItemLayout} onFinish={handleSubmit}>
                    <Form.Item hidden name="id"></Form.Item>
                    <Form.Item label="Nome" name="name" rules={[{ required: true, message: 'Favor colocar o nome!' }]}>
                        <Input placeholder="nome do cliente" />
                    </Form.Item>
                    <Form.Item
                        label="CPF"
                        name="cpf"
                        rules={[
                            {
                                required: true,
                                message: 'Favor colocar o cpf!',
                            },
                        ]}
                    >
                        <Input placeholder="cpf do cliente" />
                    </Form.Item>
                    <Form.Item
                        label="aniversario"
                        name="birthDate"
                        rules={[
                            {
                                required: true,
                                message: 'Favor colocar a data de nascimento!',
                            },
                        ]}
                    >
                        <Input type="datetime-local" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" {...buttonItemLayout} htmlType="submit">
                            {edit ? 'Editar' : 'Cadastrar'}
                        </Button>
                    </Form.Item>
                </Form>
                <Table dataSource={clients} columns={columns} />
            </Content>
        </Wrapper>
    );
};

export default Home;
