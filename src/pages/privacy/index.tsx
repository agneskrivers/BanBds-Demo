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
            <title>Chính sách bảo mật - BanBds.vn</title>
        </Head>
        <main>
            <Container>
                <Row className='justify-content-center'>
                    <Col xs={8}>
                        <h1 className={Styles.title}>Điều khoản thỏa thuận</h1>
                        <hr className='my-4' />
                        <p className={Styles.description}>
                            1. Mục đích và phạm vi thu thập thông tin
                        </p>
                        <p className={Styles.item}>
                            banbds.vn luôn cố gắng để những thông tin được đăng
                            trên trang banbds.vn là hữu ích và chính xác nhất.
                            Để thực hiện điều đó, banbds.vn yêu cầu thành viên
                            phải cung cấp đầy đủ và chính xác mọi thông tin tại
                            banbds.vn.
                        </p>
                        <p className={Styles.item}>
                            Các thông tin mà banbds.vn có thể thu thập từ thành
                            viên bao gồm: họ tên, giới tính, ngày sinh, email,
                            mã số thuế, địa chỉ, điện thoại, nghề nghiệp, nơi
                            làm việc và các thông tin cần thiết khác.
                        </p>
                        <p className={Styles.description}>
                            2. Phạm vi sử dụng thông tin
                        </p>
                        <p className={Styles.item}>
                            Các thông tin được thành viên cung cấp có thể dùng
                            vào các mục đích sau:
                        </p>
                        <ul className={Styles.list}>
                            <li>
                                Cung cấp dịch vụ trên banbds.vn mà thành viên
                                yêu cầu;
                            </li>
                            <li>
                                Gửi thông tin giới thiệu dịch vụ trên banbds.vn
                                đến thành viên;
                            </li>
                            <li>
                                Phân tích, đánh giá và hoàn thiện sản phẩm, dịch
                                vụ (kể cả website), công nghệ, quy trình;
                            </li>
                            <li>
                                Nâng cao mối tương tác và liên kết với thành
                                viên;
                            </li>
                            <li>
                                Giải quyết các vấn đề tranh chấp, khiếu nại phát
                                sinh liên quan đến việc sử dụng banbds.vn;
                            </li>
                            <li>
                                Ngăn chặn những hoạt động vi phạm pháp luật tại
                                Việt Nam.
                            </li>
                            <li>
                                Nếu không có sự đồng ý của thành viên, banbds.vn
                                sẽ không cung cấp bất kỳ thông tin nào liên quan
                                đến thành viên cho bên thứ ba để sử dụng với mục
                                đích quảng cáo.
                            </li>
                        </ul>
                        <p className={Styles.description}>
                            3. Thời gian lưu trữ thông tin
                        </p>
                        <p className={Styles.item}>
                            Các thông tin của thành viên được lữu trữ trong một
                            thời gian cần thiết, nhằm phục vụ cho các yêu cầu
                            thành viên đưa ra.
                        </p>
                        <p className={Styles.item}>
                            Thành viên có thể yêu cầu banbds.vn xóa dữ liệu cá
                            nhân khi đã chấm dứt là thành viên của banbds.vn.
                            Mọi thông tin liên quan đến vấn đề này xin vui lòng
                            gửi tới địa chỉ email DPO@banbds.vn để nhận được hỗ
                            trợ nhanh nhất.
                        </p>
                        <p className={Styles.description}>
                            4. Phương tiện và công cụ để người dùng tiếp cận và
                            chỉnh sửa dữ liệu thành viên
                        </p>
                        <p className={Styles.item}>
                            Các thành viên được cấp một tài khoản bao gồm tên
                            tài khoản và mật khẩu để truy cập banbds.vn. Sau khi
                            đăng nhập, thành viên có quyền sử dụng mọi dịch vụ,
                            tiện ích được cung cấp trên banbds.vn theo đúng chức
                            năng, quyền hạn lựa chọn và được phân quyền.
                        </p>
                        <p className={Styles.description}>
                            6. Cam kết bảo mật thông tin thành viên
                        </p>
                        <p className={Styles.item}>
                            - banbds.vn cam kết sẽ bảo mật các thông tin của
                            thành viên, nỗ lực và sử dụng các biện pháp thích
                            hợp để bảo mật các thông tin mà thành viên cung cấp
                            cho banbds.vn trong quá trình sử dụng dịch vụ trên
                            banbds.vn.
                        </p>
                        <p className={Styles.item}>
                            - Không bán, chuyển giao dữ liệu thông tin cho bên
                            thứ ba, khi chưa được sự cho phép của thành viên
                            ngoại trừ trường hợp theo yêu cầu cung cấp thông tin
                            thành viên của cơ quan nhà nước có thẩm quyền bằng
                            văn bản hoặc pháp luật có quy định khác.
                        </p>
                        <p className={Styles.item}>
                            - Trong trường hợp máy chủ lưu trữ thông tin thành
                            viên bị tấn công dẫn đến mất dữ liệu thành viên,
                            banbds.vn sẽ có trách nhiệm thông báo vụ việc cho cơ
                            quan chức năng điều tra xử lý kịp thời và thông báo
                            cho thành viên được biết.
                        </p>
                        <p className={Styles.item}>
                            - Nếu xét thấy thông tin của thành viên cung cấp
                            trên banbds.vn là không chính xác, banbds.vn sẽ tiến
                            hành hủy toàn bộ những nội dung của thành viên đó
                            được đăng tải trên banbds.vn.
                        </p>
                    </Col>
                </Row>
            </Container>
        </main>
    </>
);

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export default Index;
