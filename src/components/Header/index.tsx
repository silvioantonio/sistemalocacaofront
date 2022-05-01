import { Upload, Button, message, Space, Modal, Form, Input, notification } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Container, Content } from './styles';
import api from '../../services/api';

const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
        authorization: 'authorization-text',
    },
    async onChange(info: any) {
        if (info.file.status === 'done') {
            const formData = new FormData();
            formData.append('file', info.file.originFileObj);
            await api.post('Movie/UploadFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const Header: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    async function handleOk(data: any) {
        await api
            .get('Report/downloadData', {
                params: {
                    searchLateCostumers: data.searchLateCostumers,
                },
            })
            .then(function () {
                form.resetFields();
                notification.success({
                    message: `O download do relatorio esta completo!`,
                });
            })
            .catch(function () {
                notification.error({
                    message: `O download do relatorio não foi comcluido!`,
                });
            });
        setIsModalVisible(false);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Container>
            <Content>
                <nav>
                    <Link to="/">Clientes</Link>
                    <Link to="/location">Locações</Link>
                    <Space>
                        <Upload {...props} maxCount={1} accept=".csv">
                            <Button>
                                <UploadOutlined />
                                Enviar lista de filmes
                            </Button>
                        </Upload>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<DownloadOutlined />}
                            size="middle"
                            onClick={showModal}
                        >
                            Baixar Relatório
                        </Button>
                    </Space>
                </nav>
                <Modal
                    title="Basic Modal"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Cancelar
                        </Button>,
                    ]}
                >
                    <p>Coloque a data da locação para filtrar os clientes.</p>
                    <Form form={form} onFinish={handleOk}>
                        <Form.Item
                            label="Data do filtro"
                            name="searchLateCostumers"
                            rules={[
                                {
                                    required: true,
                                    message: 'Favor colocar a data de locação!',
                                },
                            ]}
                        >
                            <Input type="date" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Download
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Container>
    );
};

export default Header;
