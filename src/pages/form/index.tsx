import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Head from 'next/head';
import Select, { SingleValue } from 'react-select';

// Components
import { FormComponent } from '@client/components';

// Configs
import { SelectFormType } from '@client/configs';

// Layouts
import { WebLayout } from '@client/layouts';

// Interfaces
import type { NextPageWithLayout, ISelect, IPostType } from '@interfaces';

const Index: NextPageWithLayout = () => {
    // States
    const [type, setType] = useState<ISelect>(SelectFormType[0]);

    // Handles
    const handleSelectType = (value: SingleValue<ISelect>) => {
        if (value) return setType(value);
    };

    return (
        <>
            <Head>
                <title>
                    {`Đăng tin ${type.label.toLowerCase()} bất động sản - BanBds`}
                </title>
            </Head>
            <main style={{ backgroundColor: '#f7f7f7' }}>
                <Container>
                    <Row className='justify-content-center'>
                        <Col md={8}>
                            <div className='content'>
                                <Select
                                    options={SelectFormType}
                                    placeholder='Nhu cầu'
                                    value={type}
                                    onChange={handleSelectType}
                                />
                            </div>
                            {type.value !== 'request' ? (
                                <FormComponent.Post
                                    mode='create'
                                    type={type.value as IPostType}
                                />
                            ) : (
                                <FormComponent.Request />
                            )}
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
};

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export default Index;
