import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Head from 'next/head';

// Styles
import Styles from '@client/scss/pages/docs/index.module.scss';

// Layouts
import { WebLayout } from '@client/layouts';

// Interfaces
import type { NextPageWithLayout } from '@interfaces';

const Index: NextPageWithLayout = () => (
    <>
        <Head>
            <title>Giải quyết khiếu nại - BanBds.vn</title>
        </Head>
        <main>
            <Container>
                <Row className='justify-content-center'>
                    <Col xs={8}>
                        <h1 className={Styles.title}>Điều khoản thỏa thuận</h1>
                        <hr className='my-4' />
                        <p className={Styles.description}>
                            1. Nguyên tắc giải quyết tranh chấp, khiếu nại
                        </p>
                        <p className={Styles.item}>
                            - banbds.vn là cổng trung gian kết nối và cung cấp
                            thông tin bất động sản giữa bên bán và bên mua; bên
                            cho thuê và bên thuê mà không tham gia vào bất kỳ
                            hoạt động hay nội dung thỏa thuận nào trong giao
                            dịch giữa hai bên. Các bên tham gia vào giao dịch
                            mua bán, cho thuê bất động sản phải tự thẩm định và
                            chịu trách nhiệm đối với tất cả các thông tin cá
                            nhân, bất động sản và dịch vụ bất động sản khi tham
                            gia giao dịch. Theo đó, Người đăng tin phải điền đầy
                            đủ thông tin được yêu cầu cung cấp trên banbds.vn.
                            Trường hợp Người đăng tin không cung cấp đầy đủ,
                            chính xác các thông tin được yêu cầu thì banbds.vn
                            được miễn trách nhiệm theo quy định tại Điều 13 Luật
                            bảo vệ quyền lợi người tiêu dùng năm 2010. Ban quản
                            trị banbds.vn sẵn sàng hỗ trợ nhanh chóng và kịp
                            thời khi nhận được các phản hồi, khiếu nại về việc
                            Người đăng tin đăng nội dung tin đăng, quảng cáo
                            không chuẩn xác, sai sự thật… Trường hợp nhận được
                            khiếu nại, Ban quản trị banbds.vn sẽ xác nhận lại
                            thông tin, và tùy theo mức độ, banbds.vn sẽ có những
                            biện pháp xử lý phù hợp, kịp thời.
                        </p>
                        <p className={Styles.item}>
                            - banbds.vn tôn trọng và nghiêm túc thực hiện các
                            quy định của pháp luật về bảo vệ quyền lợi của người
                            tiêu dùng. Vì vậy, đề nghị Người đăng tin cung cấp
                            đầy đủ, chính xác, trung thực và chi tiết các thông
                            tin liên quan đến bất động sản và dịch vụ khác liên
                            quan (nếu có). Mọi hành vi lừa đảo, gian lận trong
                            nội dung tin đăng, giao dịch đều bị lên án và phải
                            chịu hoàn toàn trách nhiệm trước pháp luật.
                        </p>
                        <p className={Styles.item}>
                            - Các bên liên quan bao gồm: Người đăng tin và người
                            mua/ bán/cho thuê/ thuê có vai trò và trách nhiệm
                            trong việc giải quyết các vấn đề phát sinh (nếu có).
                        </p>
                        <p className={Styles.item}>
                            - Người mua/ bán/ cho thuê/ thuê có thể gửi khiếu
                            nại trực tiếp đến Người đăng tin hoặc thông qua ban
                            quản trị banbds.vn. Sau khi tiếp nhận khiếu nại,
                            banbds.vn sẽ sẽ chuyển ngay khiếu nại đó đến Người
                            đăng tin bằng các phương thức nhanh chóng nhất.
                        </p>
                        <p className={Styles.item}>
                            - Người đăng tin phải chịu toàn bộ trách nhiệm về
                            nội dung tin đăng trên banbds.vn. Trường hợp có
                            khiếu nại phát sinh, Người đăng tin có trách nhiệm
                            cung cấp văn bản giấy tờ chứng thực thông tin liên
                            quan đến sự việc đang gây mâu thuẫn, khiếu nại cho
                            banbds.vn và người có khiếu nại. Trong mọi trường
                            hợp, Người đăng tin phải có trách nhiệm giải quyết
                            mọi khiếu nại của người có khiếu nại liên quan đến
                            bất động sản và dịch vụ bất động sản đi kèm (nếu
                            có).
                        </p>
                        <p className={Styles.item}>
                            - Trong trường hợp phát sinh mâu thuẫn, khiếu nại,
                            tranh chấp các bên sẽ ưu tiên giải quyết bằng biện
                            pháp thương lượng, hòa giải. Trong trường hợp thương
                            lượng, hòa giải không thành công thì banbds.vn yêu
                            cầu các bên gửi đơn đến cơ quan nhà nước có thẩm
                            quyền để giải quyết theo quy định của pháp luật.
                        </p>
                        <p className={Styles.description}>
                            2. Quy trình tiếp nhận và giải quyết khiếu nại,
                            tranh chấp:
                        </p>
                        <ul className={Styles.list}>
                            <li>
                                Bước 1: Tất cả các yêu cầu giải quyết khiếu nại,
                                tranh chấp sẽ được chuyển đến Bộ phận Chăm sóc
                                khách hàng để tiếp nhận.
                                <p className={Styles.item}>
                                    Hotline: (024)35625939/
                                    (024)35625940/19001881; email:
                                    hotro@banbds.vn
                                </p>
                            </li>
                            <li>
                                Bước 2: Bộ phận Chăm sóc khách hàng sẽ tiếp nhận
                                các khiếu nại nhanh chóng kịp thời tiến hành xác
                                minh lại những thông tin được cung cấp (qua nhân
                                viên có liên quan, và nội dung thông tin trên
                                banbds.vn) và chuyển yêu cầu giải quyết khiếu
                                nại tranh chấp sang Bộ phận Kinh doanh để đưa ra
                                phương án giải quyết.
                            </li>
                            <li>
                                Bước 3: Bộ phận Kinh doanh đề xuất phương án
                                giải quyết khiếu nại, tranh chấp và phản hồi Bộ
                                phận Chăm sóc khách hàng.
                            </li>
                            <li>
                                Bước 4: Bộ phận Chăm sóc khách hàng xin ý kiến
                                phê duyệt của Ban Giám đốc.
                            </li>
                            <li>
                                Bước 5: Ban Giám đốc xem xét và phê duyệt phương
                                án giải quyết khiếu nại, tranh chấp.
                            </li>
                            <li>
                                Bước 6: Bộ phận Chăm sóc khách hàng phản hồi với
                                người có yêu cầu giải quyết khiếu nại, tranh
                                chấp về nội dung khiếu nại, tranh chấp và phương
                                án giải quyết khiếu nại, tranh chấp (nếu có).
                            </li>
                        </ul>
                        <p className={Styles.item}>
                            Trường hợp người có yêu cầu khiếu nại, tranh chấp
                            đồng ý với nội dung và phương án giải quyết khiếu
                            nại, tranh chấp thì quy trình tiếp nhận giải quyết
                            khiếu nại, tranh chấp kết thúc.
                        </p>
                        <p className={Styles.item}>
                            Trường hợp người có yêu cầu khiếu nại, tranh chấp
                            không đồng ý với phương án giải quyết khiếu nại,
                            tranh chấp và yêu cầu giải quyết lại thì yêu cầu
                            giải quyết lại khiếu nại, tranh chấp được Bộ phận
                            Chăm sóc khách hàng tiếp nhận. Quy trình lặp lại các
                            Bước 2, 3, 4, 5 và 6. Tại Bước 6, nếu thành viên vẫn
                            không đồng ý với phương án giải quyết khiếu nại,
                            tranh chấp mà Bộ phận Chăm sóc khách hàng đưa ra,
                            người có yêu cầu khiếu nại, tranh chấp có quyền khởi
                            kiện tại tòa án hoặc trọng tài theo các quy định của
                            pháp luật.
                        </p>
                    </Col>
                </Row>
            </Container>
        </main>
    </>
);

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export default Index;
