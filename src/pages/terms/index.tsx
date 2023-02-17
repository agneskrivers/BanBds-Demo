import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Head from 'next/head';
import classNames from 'classnames';

// Styles
import Styles from '@client/scss/pages/docs/index.module.scss';

// Layouts
import { WebLayout } from '@client/layouts';

// Interfaces
import type { NextPageWithLayout } from '@interfaces';

const Index: NextPageWithLayout = () => (
    <>
        <Head>
            <title>Điều khoản thỏa thuận - BanBds.vn</title>
        </Head>
        <main>
            <Container>
                <Row className='justify-content-center'>
                    <Col xs={8}>
                        <h1 className={Styles.title}>Điều khoản thỏa thuận</h1>
                        <hr className='my-4' />
                        <p className={Styles.item}>
                            Trước hết, chúng tôi xin chân thành cám ơn các bạn
                            đã quan tâm và có mong muốn sử dụng dịch vụ của
                            chúng tôi. Trước khi bắt đầu tham quan banbds.vn
                            cũng như sử dụng các dịch vụ trên trang website, xin
                            vui lòng đọc cẩn thận và ghi nhớ Điều khoản Thoả
                            thuận này. Việc sử dụng hoặc truy cập vào website
                            banbds.vn sẽ được hiểu là sự chấp nhận và đồng ý
                            ràng buộc vào Điều khoản Thoả thuận.
                        </p>
                        <p
                            className={classNames(
                                Styles.description,
                                Styles.description_center
                            )}
                        >
                            Điều Khoản Thoả Thuận truy cập website banbds.vn
                        </p>
                        <p className={Styles.item}>
                            Điều khoản Thoả thuận này được ký kết bởi và giữa
                            banbds.vn với bất kỳ một cá nhân tổ chức hoặc một
                            thực thể nào khác, những người truy cập hoặc sử dụng
                            website banbds.vn (được gọi chung là &quot;Người sử
                            dụng&quot; hoặc &quot;bạn&quot;). banbds.vn là
                            website được thiết kế cho phép thông tin về bất động
                            sản và các lĩnh vực liên quan, bao gồm cả việc những
                            người sử dụng đăng thông tin quảng cáo nhu cầu
                            mua/bán/thuê/cho thuê bất động sản do những người sử
                            dụng khác đăng lên, hoặc tương tác với những người
                            sử dụng đó. banbds.vn chứa hoặc có thể chứa các
                            thông tin, tin tức, các ý kiến, văn bản, đồ hoạ, các
                            liên kết, sản phẩm nghệ thuật điện tử, hình ảnh
                            động, âm thanh, video, phần mềm, tranh ảnh, âm nhạc,
                            tiếng động và các nội dung, dữ liệu khác (gọi chung
                            là &quot;nội dung&quot;) được định dạng, tổ chức và
                            thu thập dưới nhiều hình thức khác nhau mà người sử
                            dụng có thể truy cập tới được, gồm thông tin trên
                            website của banbds.vn mà người sử dụng có thể thay
                            đổi được, chẳng hạn như đăng thông tin quảng cáo
                            mua/bán/thuê/cho thuê bất động sản, tải lên các tập
                            tin đa phương tiện.
                        </p>
                        <p className={Styles.description}>
                            1. Trách nhiệm và hạn chế đối với người sử dụng
                        </p>
                        <p className={Styles.description}>
                            1.1 Trách nhiệm của người sử dụng
                        </p>
                        <p className={Styles.item}>
                            Bạn đồng ý chỉ truy cập và dùng website banbds.vn
                            với các mục đích hợp pháp. Bạn có trách nhiệm về
                            việc hiểu biết và tuân thủ mọi điều luật, các quy
                            chế, quy tắc và các quy định gắn liền với: (i) việc
                            bạn sử dụng website banbds.vn, kể cả vùng tương tác
                            bất kỳ, (ii) việc sử dụng mạng hay dịch vụ nào khác
                            có kết nối tới website banbds.vn , (iii) phương tiện
                            liên lạc mà nhờ đó, bạn nối modem, máy tính hoặc các
                            thiết bị khác của bạn tới website banbds.vn.
                        </p>
                        <p className={Styles.item}>
                            Bằng việc cung cấp thông tin bao gồm nhưng không
                            giới hạn số điện thoại, email khi đăng ký tài khoản
                            thành viên hay các trường thu thập thông tin trên
                            website banbds.vn, bạn đồng ý nhận các cuộc gọi, tin
                            nhắn, email từ banbds.vn bao gồm không giới hạn các
                            nội dung liên quan đến chăm sóc khách hàng, giới
                            triệu, quảng cáo dịch vụ của banbds.vn cũng như các
                            sản phẩm, dịch vụ của cổ đông sở hữu, công ty liên
                            kết, đơn vị thành viên của công ty sở hữu website
                            banbds.vn.
                        </p>
                        <p className={Styles.item}>
                            Bạn đồng ý rằng hành động duy nhất thể hiện yêu cầu
                            của bạn về việc đề nghị banbds.vn chấm dứt thực hiện
                            cuộc gọi, gửi tin nhắn, gửi email đến bạn đó là xóa
                            tài khoản thành viên trên banbds.vn theo Quy chế
                            hoạt động của website banbds.vn hoặc gửi yêu cầu
                            bằng văn bản/hình thức khác tương đương tới
                            banbds.vn.
                        </p>
                        <p className={Styles.description}>
                            1.2. Hạn chế đối với người sử dụng
                        </p>
                        <p
                            className={classNames(
                                Styles.item,
                                Styles.item_list
                            )}
                        >
                            Truy cập tới website banbds.vn, bạn đồng ý sẽ không:
                        </p>
                        <ul className={Styles.list}>
                            <li>
                                Sử dụng bất kỳ thiết bị, phần mềm, quy trình,
                                phương tiện để can thiệp hay cố gắng can thiệp
                                vào hoạt động đúng đắn trên banbds.vn;
                            </li>
                            <li>
                                Hạn chế hoặc ngăn cản người sử dụng khác sử dụng
                                và hưởng các tính năng tương tác;
                            </li>
                            <li>
                                Thực hiện bất kỳ hành động mà sẽ áp đặt một gánh
                                nặng hoặc làm cho lưu lượng truy cập vào cơ sở
                                hạ tầng của banbds.vn quá nhiều mà chúng tôi cho
                                là không hợp lý hay không cân xứng với cách sử
                                dụng banbds.vn;
                            </li>
                            <li>
                                Gửi hoặc chuyển các thông tin bất hợp pháp, đe
                                doạ, lạm dụng, bôi nhọ, nói xấu, khiêu dâm, phi
                                thẩm mỹ, xúc phạm hoặc bất kỳ loại thông tin
                                không đúng đắn, bao gồm truyền bá tin tức góp
                                phần hay khuyến khích hành vi phạm tội, gây ra
                                trách nhiệm pháp lý dân sự hoặc vi phạm luật bất
                                kỳ của một địa phương, bang, quốc gia, hay luật
                                quốc tế nào;
                            </li>
                            <li>
                                Gửi hay chuyển các thông tin, phần mềm, hoặc các
                                tài liệu khác bất kỳ, vi phạm hoặc xâm phạm các
                                quyền của những người khác, trong đó bao gồm cả
                                tài liệu xâm phạm đến quyền riêng tư hoặc công
                                khai, hoặc tài liệu được bảo vệ bản quyền, tên
                                thương mại hoặc quyền sở hữu khác, hoặc các sản
                                phẩm phái sinh mà không được sự cho phép của
                                người chủ sở hữu hoặc người có quyền hợp pháp;
                            </li>
                            <li>
                                Gửi hoặc chuyển thông tin, phần mềm hoặc tài
                                liệu bất kỳ có chứa virus hoặc một thành phần
                                gây hại khác;
                            </li>
                            <li>
                                Thay đổi, làm hư hại, xoá nội dung bất kỳ hoặc
                                các phương tiện khác mà không phải là nội dung
                                thuộc sở hữu của bạn; hoặc gây trở ngại cho
                                những người khác truy cập tới website banbds.vn;
                            </li>
                            <li>
                                Gửi hoặc chuyển thư rác, thông tin về các cuộc
                                thi, thông tin khảo sát, hoặc nhắn tin đại chúng
                                khác, cho dù với mục đích thương mại hay không;
                            </li>
                            <li>
                                Phá vỡ luồng thông tin bình thường trong một
                                tương tác;
                            </li>
                            <li>
                                Tuyên bố có liên hệ với hay phát ngôn cho một
                                doanh nghiệp, hiệp hội, thể chế hay tổ chức nào
                                khác mà bạn không được uỷ quyền tuyên bố mối
                                liên hệ đó;
                            </li>
                            <li>
                                Vi phạm một quy tắc, chính sách hay hướng dẫn sử
                                dụng nào của nhà cung cấp dịch vụ Internet cho
                                bạn hay các dịch vụ trực tuyến;
                            </li>
                        </ul>
                        <p className={Styles.item}>
                            Khi có hành vi vi phạm các quy định nêu trên, chúng
                            tôi có quyền thực hiện bất kỳ hành động hợp pháp nào
                            mà chúng tôi cho là cần thiết để ngăn chặn sự truy
                            cập, sử dụng trái phép website banbds.vn, bao gồm
                            việc sử dụng rào cản công nghệ, hoặc báo cáo về hành
                            vi của bạn tới cơ quan nhà nước có thẩm quyền.
                        </p>
                        <p className={Styles.description}>
                            2. Các quyền sở hữu trí tuệ
                        </p>
                        <ul className={Styles.list}>
                            <li>
                                Bạn thừa nhận Nội dung trên website banbds.vn
                                nói chung do banbds.vn, cộng tác viên cá nhân về
                                nội dung (&quot;Cộng tác viên&quot;), người được
                                cấp phép thứ ba, và/hoặc những người sử dụng
                                khác cung cấp. Bạn thừa nhận website banbds.vn
                                cho phép truy cập tới Nội dung được bảo vệ bản
                                quyền, tên thương mại và các quyền sở hữu khác
                                (kể cả quyền sở hữu trí tuệ) (&quot;Quyền Sở hữu
                                Trí tuệ&quot;), và thừa nhận các quyền sở hữu
                                trí tuệ đó là hợp lệ và được bảo vệ trên mọi
                                phương tiện truyền thông hiện có và sau này, trừ
                                những điểm nêu rõ ràng dưới đây, việc sử dụng
                                nội dung của bạn sẽ được quản lý theo các luật
                                bản quyền và các luật sở hữu trí tuệ hiện hành
                                khác.
                            </li>
                            <li>
                                Bạn không thể thay đổi, sao chép, mô phỏng,
                                truyền, phân phối, công bố, tạo ra các sản phẩm
                                phái sinh, hiển thị hoặc chuyển giao, hoặc khai
                                thác nhằm mục đích thương mại bất kỳ phần nào
                                của nội dung, toàn bộ hay từng phần, mặc dù bạn
                                có thể: (i) tạo một số lượng hợp lý các bản sao
                                dưới dạng số hoặc hình thức khác để phần cứng và
                                phần mềm máy tính của bạn có thể truy cập và xem
                                được nội dung, (ii) in một bản sao của từng đoạn
                                nội dung, (iii) tạo và phân phối một số lượng
                                hợp lý các bản sao nội dung, toàn bộ hay từng
                                phần, ở dạng bản in hoặc bản điện tử để dùng nội
                                bộ. Bất kỳ bản sao nội dung được phép nào cũng
                                phải được tái tạo ở dạng không thể biến đổi được
                                các thông tri bất kỳ chứa trong nội dung, chẳng
                                hạn như tất cả các thông tri về Quyền Sở hữu Trí
                                tuệ, và các nguồn thông tin ban đầu cho “website
                                banbds.vn” và địa chỉ mạng (URL) của nó. Bạn
                                thừa nhận, website banbds.vn, các cộng tác viên,
                                và/hoặc những người sử dụng vẫn là những người
                                chủ sở hữu của nội dung và rằng, bạn sẽ không có
                                bất kỳ Quyền Sở hữu Trí tuệ nào qua việc tải
                                xuống hoặc in nội dung.
                            </li>
                        </ul>
                        <p className={Styles.item}>
                            Nội dung do Người sử dụng cung cấp
                        </p>
                        <p className={Styles.item}>
                            Nội dung do Người sử dụng cung cấp Bạn chỉ có thể
                            tải lên vùng tương tác bất kỳ hoặc truyền, gửi, công
                            bố, mô phỏng hoặc phân phối trên hoặc thông qua
                            website banbds.vn phần nội dung, không phụ thuộc vào
                            bất kỳ Quyền Sở hữu Trí tuệ nào, hoặc nội dung mà
                            người giữ Quyền Sở hữu Trí tuệ có sự ủy quyền rõ
                            ràng về việc phân tán trên Internet và trên website
                            banbds.vn mà không có hạn chế gì. Mọi nội dung được
                            đưa ra với sự đồng ý của người sở hữu bản quyền
                            không phải là bạn phải kèm theo câu như “do [tên
                            người chủ sở hữu] sở hữu bản quyền; được dùng theo
                            ủy quyền”.
                        </p>
                        <p className={Styles.item}>
                            Với việc đưa nội dung lên vùng tương tác bất kỳ, bạn
                            tự động chấp nhận và/hoặc cam đoan rằng, chủ sở hữu
                            của nội dung đó , hoặc là bạn, hoặc là nhóm thứ ba,
                            đã cho website banbds.vn quyền và giấy phép không
                            phải trả tiền bản quyền, lâu dài, không thay đổi,
                            không loại trừ, không hạn chế để sử dụng, mô phỏng,
                            thay đổi, sửa lại, công bố, dịch thuật, tạo các sản
                            phẩm phái sinh, cấp phép con, phân phối, thực hiện
                            và hiển thị nội dung đó, toàn phần hay từng phần,
                            khắp thế giới và/hoặc kết hợp nó với các công việc
                            khác ở dạng bất kỳ, qua các phương tiện truyền thông
                            hoặc công nghệ hiện tại hay sẽ phát triển sau này
                            theo điều khoản đầy đủ của Quyền Sở hữu Trí tuệ bất
                            kỳ trong nội dung đó. Bạn cũng cho phép website
                            banbds.vn cấp giấy phép con cho bên thứ ba quyền
                            không hạn chế để thực hiện bất kỳ quyền nào ở trên
                            với nội dung đó. Bạn cũng cho phép người dùng truy
                            cập, xem, lưu và mô phỏng lại nội dung để sử dụng
                            riêng. Bạn cũng cho phép website banbds.vn dùng tên
                            và logo công ty vì các mục đích tiếp thị
                        </p>
                        <p className={Styles.description}>
                            3. Các vùng tương tác
                        </p>
                        <p className={Styles.item}>
                            Bạn thừa nhận, website banbds.vn có thể chứa các
                            vùng tương tác khác nhau. Những vùng tương tác này
                            cho phép phản hồi tới website banbds.vn và tương tác
                            thời gian thực giữa những người sử dụng. Bạn cũng
                            hiểu rằng, website banbds.vn không kiểm soát các
                            thông báo, thông tin hoặc các tập tin được phân phối
                            tới các vùng tương tác như vậy và rằng, website
                            banbds.vn có thể cho bạn và những người sử dụng khác
                            khả năng tạo và quản lý một vùng tương tác.
                        </p>
                        <p className={Styles.item}>
                            Tuy nhiên, website banbds.vn, công ty mẹ, hoặc các
                            chi nhánh, cũng như các giám đốc, nhân viên, những
                            người làm thuê và các đại lý tương ứng không chịu
                            trách nhiệm về nội dung trong vùng tương tác bất kỳ.
                            Việc sử dụng và quản lý một vùng tương tác của bạn
                            sẽ bị chi phối bởi Điều khoản Thoả thuận này và các
                            quy tắc bổ sung bất kỳ, hoặc bởi các thủ tục hoạt
                            động của vùng tương tác bất kỳ do bạn hay người sử
                            dụng khác thiết lập. Bạn công nhận rằng, website
                            banbds.vn không thể và không có ý định sàng lọc các
                            thông tin trước. Ngoài ra, vì website banbds.vn
                            khuyến khích liên lạc mở và không thiên vị trong các
                            vùng tương tác nên website banbds.vn không thể xác
                            định trước mức độ chính xác hoặc sự phù hợp đối với
                            Điều khoản Thoả thuận này về nội dung bất kỳ được
                            chuyển đi trong vùng tương tác.
                        </p>
                        <p className={Styles.item}>
                            Tuy nhiên, website banbds.vn, công ty mẹ, hoặc các
                            chi nhánh, cũng như các giám đốc, nhân viên, những
                            người làm thuê và các đại lý tương ứng không chịu
                            trách nhiệm về nội dung trong vùng tương tác bất kỳ.
                            Việc sử dụng và quản lý một vùng tương tác của bạn
                            sẽ bị chi phối bởi Điều khoản Thoả thuận này và các
                            quy tắc bổ sung bất kỳ, hoặc bởi các thủ tục hoạt
                            động của vùng tương tác bất kỳ do bạn hay người sử
                            dụng khác thiết lập. Bạn công nhận rằng, website
                            banbds.vn không thể và không có ý định sàng lọc các
                            thông tin trước. Ngoài ra, vì website banbds.vn
                            khuyến khích liên lạc mở và không thiên vị trong các
                            vùng tương tác nên website banbds.vn không thể xác
                            định trước mức độ chính xác hoặc sự phù hợp đối với
                            Điều khoản Thoả thuận này về nội dung bất kỳ được
                            chuyển đi trong vùng tương tác.
                        </p>
                        <p className={Styles.description}>4. Chấm dứt</p>
                        <p className={Styles.item}>
                            Quyền duy nhất của bạn khi không thỏa mãn với mọi
                            chính sách, nguyên tắc chỉ đạo hay hành động thực
                            tiễn của website banbds.vn trong điều hành trang
                            web, hoặc mọi thay đổi về nội dung là dừng sự truy
                            cập tới website banbds.vn. Website banbds.vn có thể
                            chấm dứt hoặc tạm thời ngưng sự truy cập của bạn đến
                            tất cả hay phần bất kỳ của website banbds.vn mà
                            không thông báo với các hành động khi banbds.vn tin
                            là vi phạm Điều khoản Thỏa thuận này hoặc vi phạm
                            mọi chính sách hay nguyên tắc chỉ đạo mà website
                            banbds.vn đã đưa ra, hoặc với các hành động khác mà
                            chúng tôi tin là có hại đến website banbds.vn và
                            những người sử dụng khác.
                        </p>
                        <p className={Styles.item}>
                            Website banbds.vn với đặc quyền riêng có thể đình
                            chỉ sự hoạt động của nó và chấm dứt Điều khoản Thỏa
                            thuận này mà không thông báo vào bất kỳ lúc nào và
                            vì bất kỳ lý do nào theo đặc quyền của mình. Trong
                            trường hợp chấm dứt, bạn không còn được phép truy
                            cập đến website banbds.vn nữa, kể cả các vùng tương
                            tác và các hạn chế của bạn về nội dung đươc tải
                            xuống từ banbds.vn, cũng như những từ chối về quyền
                            lợi và các giới hạn về các trách nhiệm pháp lý được
                            nêu ra trong thỏa thuận này, vẫn còn giá trị.
                        </p>
                        <p className={Styles.description}>5. Các liên kết</p>
                        <p className={Styles.item}>
                            Bạn hiểu rằng trừ phần nội dung, các sản phẩm và
                            dịch vụ có trên website banbds.vn, công ty mẹ, hoặc
                            các chi nhánh, cũng như các giám đốc, nhân viên,
                            người làm công và các đại lý tương ứng kiểm soát,
                            cung cấp không chịu trách nhiệm với nội dung, hàng
                            hóa hoặc các dịch vụ của các sites khác trên
                            Internet được kết nối tới hoặc từ website banbds.vn.
                            Tất cả nội dung, hàng hóa và các dịch vụ đó đều có
                            thể truy cập được trên Internet bởi bên thứ ba độc
                            lập và không phải là một phần của website banbds.vn
                            hoặc được kiểm soát bởi banbds.vn. Website banbds.vn
                            không xác nhận và cũng không chịu trách nhiệm về
                            tính chính xác, tính đầy đủ, tính hữu dụng, chất
                            lượng và tính sẵn sàng của mọi nội dung, hàng hóa
                            hay các dịch vụ có trên các site được kết nối tới
                            hoặc từ website banbds.vn mà đó là trách nhiệm duy
                            nhất của bên thứ ba độc lập đó, và do vậy việc sử
                            dụng của bạn là sự mạo hiểm riêng của bạn.
                        </p>
                        <p className={Styles.item}>
                            Website banbds.vn, công ty mẹ, hoặc các chi nhánh,
                            hoặc các giám đốc, nhân viên, người làm công và các
                            đại lý tương ứng không chịu trách nhiệm pháp lý,
                            trực tiếp hay gián tiếp, với mọi mất mát hay thiệt
                            hại gây ra bởi hoặc bị cho là gây ra bởi việc sử
                            dụng hoặc sự tin cậy của bạn vào mọi nội dung, hàng
                            hóa hoặc các dịch vụ có trên site bất kỳ được kết
                            nối đến hoặc từ website banbds.vn, hoặc do bạn không
                            thể truy cập lên Internet hay site bất kỳ kết nối
                            đến hoặc từ website banbds.vn.
                        </p>
                        <p className={Styles.description}>6. Bồi thường</p>
                        <p className={Styles.item}>
                            Bạn đồng ý trả tiền và miễn cho website banbds.vn,
                            công ty mẹ và các chi nhánh, các giám đốc, nhân
                            viên, những người làm công và các đại lý tương ứng
                            tất cả các trách nhiệm pháp lý, các quyền được đòi
                            hỏi và các phí tổn, kể cả các phí hợp lý cho luật
                            sư, nảy sinh từ sự vi phạm Điều khoản Thỏa thuận
                            này, từ chính sách bất kỳ khác, từ việc sử dụng hay
                            truy cập của bạn tới website banbds.vn hoặc site
                            internet được kết nối đến hoặc từ website banbds.vn,
                            hoặc về việc truyền nội dung bất kỳ trên website
                            banbds.vn.
                        </p>
                        <p className={Styles.description}>7. Các vấn đề khác</p>
                        <p className={Styles.item}>
                            Điều khoản Thoả thuận này bao gồm toàn bộ sự thoả
                            thuận giữa website banbds.vn và bạn, và thay thế mọi
                            thoả thuận trước đây về chủ đề này. Website
                            banbds.vn có thể xét lại Điều khoản Thoả thuận này
                            hoặc mọi chính sách khác vào bất cứ lúc nào và đôi
                            khi, sự xem xét lại này sẽ có hiệu lực trong 2 ngày
                            nhờ gửi thông báo về sự xem xét lại đó ở nơi dễ thấy
                            trên website banbds.vn. Bạn đồng ý xem xét lại Điều
                            khoản Thoả thuận này định kỳ để hiểu về những điều
                            đã được sửa lại đó. Nếu bạn không chấp nhận các sửa
                            đổi này, bạn phải thôi truy cập tới website
                            banbds.vn . Sự tiếp tục truy cập của bạn và việc sử
                            dụng website banbds.vn sau thông báo về mọi sửa đổi
                            như vậy sẽ được coi chắc chắn là sự chấp nhận tất cả
                            các sửa đổi như vậy.
                        </p>
                        <p className={Styles.item}>
                            Việc website banbds.vn không thể đòi hỏi hoặc buộc
                            thực hiện chặt chẽ mọi điều khoản của Điều khoản
                            Thoả thuận này sẽ không được coi là sự khước từ điều
                            khoản hay quyền bất kỳ.
                        </p>
                        <p className={Styles.item}>
                            Xin cám ơn bạn đã dành thời gian đọc bản Thỏa thuận
                            này, và một lần nữa xin cám ơn bạn đã sử dụng dịch
                            vụ của chúng tôi. Hy vọng rằng những thông tin trên
                            banbds.vn sẽ hữu ích đối với bạn.
                        </p>
                    </Col>
                </Row>
            </Container>
        </main>
    </>
);

Index.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export default Index;
