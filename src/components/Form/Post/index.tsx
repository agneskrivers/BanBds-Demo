/* eslint-disable @next/next/no-img-element */
/* eslint-disable indent */
import React, {
    FunctionComponent,
    useContext,
    useState,
    useEffect,
    useRef,
} from 'react';
import classNames from 'classnames';
import {
    Row,
    Col,
    Form,
    InputGroup,
    Button,
    ProgressBar,
    Spinner,
} from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import { useRouter } from 'next/router';

// Styles
import Styles from '../styles/index.module.scss';

// Components
import { LoginComponent } from '@client/components';

// Configs
import {
    SelectCategory,
    SelectDirection,
    SelectLegal,
    regexPhoneNumber,
} from '@client/configs';

// Context
import { Context } from '@client/context/Web';

// Services
import services from '@client/services';

// Interfaces
import type {
    IPostType,
    ISelect,
    IPostLegal,
    IPostDirection,
    IPostCategory,
    IPostCreate,
    IMyPostInfo,
    IPostUpdateForUser,
    IPoster,
    IPostLocation,
} from '@interfaces';

// Type
type EventInput = React.ChangeEvent<HTMLInputElement>;
type EventSelect = React.ChangeEvent<HTMLSelectElement>;
type StatusImage = 'normal' | 'uploading' | 'success' | 'failed';

// Interface
interface PropsModeCreate {
    mode: 'create';
    type: IPostType;
}
interface PropsModeEdit {
    mode: 'edit';
    data: IMyPostInfo;
}

// Props
type Props = PropsModeCreate | PropsModeEdit;

const Index: FunctionComponent<Props> = (props) => {
    // States
    const [isSave, setIsSave] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isSold, setIsSold] = useState<boolean>(false);

    const [districts, setDistricts] = useState<ISelect[] | null>(null);
    const [wards, setWards] = useState<ISelect[] | null>(null);

    const [category, setCategory] = useState<ISelect>();
    const [region, setRegion] = useState<ISelect>();
    const [district, setDistrict] = useState<ISelect>();
    const [ward, setWard] = useState<ISelect>();
    const [address, setAddress] = useState<string>();

    const [title, setTitle] = useState<string>();
    const [content, setContent] = useState<string>();
    const [acreages, setAcreages] = useState<string>();
    const [prices, setPrices] = useState<string>();
    const [unit, setUnit] = useState<'million' | 'billion'>('million');
    const [legal, setLegal] = useState<ISelect>();
    const [direction, setDirection] = useState<ISelect>();
    const [ways, setWays] = useState<string>();
    const [facades, setFacades] = useState<string>();
    const [contact, setContact] = useState<string>();
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [video, setVideo] = useState<string>();

    const [images, setImages] = useState<string[]>([]);
    const [imagesRemove, setImagesRemove] = useState<string[]>([]);
    const [imageTemp, setImageTemp] = useState<File>();
    const [imageSuccess, setImageSuccess] = useState<string>();
    const [imageRemove, setImageRemove] = useState<string>();

    const [statusImage, setStatusImage] = useState<StatusImage>('normal');
    const [progress, setProgress] = useState<number>(0);

    // Ref
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Hooks
    const { user, regions, onNotification, onLogout } = useContext(Context);
    const router = useRouter();

    // Effects
    useEffect(() => {
        const controller = new AbortController();

        if (props.mode === 'edit') {
            const getData = async (
                signal: AbortSignal,
                regionID: string,
                districtID: string
            ) => {
                const resultDistricts = await services.common.address.districts(
                    signal,
                    regionID
                );
                const resultWards = await services.common.address.wards(
                    signal,
                    districtID
                );

                if (!resultDistricts || !resultWards) throw new Error();

                if (
                    resultDistricts === 'BadRequest' ||
                    resultWards === 'BadRequest'
                ) {
                    onNotification('Có lỗi xảy ra!', 'warning');

                    return;
                }

                setDistricts(
                    [...resultDistricts].map((item) => ({
                        label: item.name,
                        value: item.districtID,
                    }))
                );
                setWards(
                    [...resultWards].map((item) => ({
                        label: item.name,
                        value: item.wardID,
                    }))
                );
            };

            setUnit(props.data.prices >= 1000 ? 'billion' : 'million');

            getData(
                controller.signal,
                props.data.location.region,
                props.data.location.district
            ).catch(() => {
                onNotification('Máy chủ bị lỗi!', 'danger');
            });
        }

        return () => controller.abort();
    }, []);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, id: string) => {
            const result = await services.common.address.districts(signal, id);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setRegion(undefined);

                onNotification(
                    'Lấy danh sách Quận/Huyện không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setDistricts(
                [...result].map(({ districtID, name }) => ({
                    value: districtID,
                    label: name,
                }))
            );
        };

        if (region) {
            getData(controller.signal, region.value).catch(() => {
                setRegion(undefined);

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!');
            });
        }

        return () => controller.abort();
    }, [region]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, id: string) => {
            const result = await services.common.address.wards(signal, id);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setRegion(undefined);

                onNotification(
                    'Lấy danh sách Phường/Xã không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setWards(
                [...result].map(({ wardID, name }) => ({
                    value: wardID,
                    label: name,
                }))
            );
        };

        if (district) {
            getData(controller.signal, district.value).catch(() => {
                setRegion(undefined);

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!');
            });
        }

        return () => controller.abort();
    }, [district]);
    useEffect(() => {
        let id: NodeJS.Timeout;

        if (statusImage === 'uploading') {
            if (progress >= 100) return;

            id = setTimeout(
                () => setProgress((preProgress) => preProgress + 1),
                10
            );
        }

        return () => clearTimeout(id);
    }, [progress, statusImage, imageTemp]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, body: FormData) => {
            const result = await services.common.images.upload(signal, body);

            if (!result) throw new Error();

            if (result === 'ImageFormat') {
                setStatusImage('normal');
                setProgress(0);
                setImageTemp(undefined);

                onNotification(
                    'Định dạng ảnh không hỗ trợ. Vui lòng chọn lại!',
                    'warning'
                );

                return;
            }

            if (result === 'ImageToBig') {
                setStatusImage('normal');
                setProgress(0);
                setImageTemp(undefined);

                onNotification(
                    'Dung lượng ảnh quá lớn. Vui lòng chọn ảnh khác!',
                    'warning'
                );

                return;
            }

            if (result === 'NotFound') {
                setStatusImage('normal');
                setProgress(0);
                setImageTemp(undefined);

                onNotification(
                    'Không có hỉnh ảnh. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            if (result === 'Unauthorized') throw new Error();

            setImageSuccess(result.data);
        };

        if (statusImage === 'uploading' && imageTemp !== undefined) {
            const body = new FormData();

            body.append('file', imageTemp);

            getData(controller.signal, body).catch(() => {
                setStatusImage('failed');
                setProgress(0);
                setImageTemp(undefined);

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!');
            });
        }

        return () => controller.abort();
    }, [statusImage, imageTemp]);
    useEffect(() => {
        if (imageSuccess && progress >= 100) {
            setStatusImage('success');
        }
    }, [imageSuccess, progress]);
    useEffect(() => {
        let id: NodeJS.Timeout;

        if (statusImage === 'failed' && imageTemp === undefined) {
            id = setTimeout(() => setStatusImage('normal'), 1500);
        }

        return () => clearTimeout(id);
    }, [statusImage, imageTemp]);
    useEffect(() => {
        let id: NodeJS.Timeout;

        if (
            statusImage === 'success' &&
            imageSuccess !== undefined &&
            progress >= 100
        ) {
            onNotification('Tải ảnh thành công!', 'success');

            id = setTimeout(() => {
                setStatusImage('normal');
                setProgress(0);
                setImages((preImages) => [...preImages, imageSuccess]);
                setImageSuccess(undefined);
                setImageTemp(undefined);
            }, 1000);
        }

        return () => clearTimeout(id);
    }, [statusImage, imageSuccess, progress]);
    useEffect(() => {
        const controller = new AbortController();

        const create = async (signal: AbortSignal, body: IPostCreate) => {
            const result = await services.posts.create(signal, body);

            if (!result) throw new Error();

            if (result === 'BadRequest') {
                setIsSave(false);

                onNotification(
                    'Tạo tin đăng không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            if (result === 'Unauthorized') {
                setIsSave(false);

                onNotification('Vui lòng đăng nhập', 'warning');

                if (user) {
                    onLogout();
                }

                setIsLogin(true);

                return;
            }

            setIsSave(false);
            handleReset();
            onNotification('Đăng tin thành công', 'success');
        };
        const edit = async (
            signal: AbortSignal,
            postID: number,
            body: IPostUpdateForUser
        ) => {
            const result = await services.posts.update(signal, postID, body);

            if (!result) throw new Error();

            if (result === 'Unauthorized') {
                setIsSave(false);

                onNotification('Vui lòng đăng nhập', 'warning');

                if (user) {
                    onLogout();
                }

                setIsLogin(true);

                return;
            }

            if (result === 'BadRequest') {
                setIsSave(false);

                onNotification(
                    'Lưu tin đăng không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            if (result === 'NotFound') {
                setIsSave(false);

                onNotification('Không tìm thấy tin đăng!', 'info');

                router.push('/quan-ly-tin-dang');

                return;
            }

            if (result !== true) {
                setIsSave(false);

                onNotification(
                    'Lưu tin đăng không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setIsSave(false);
            handleReset();

            onNotification('Lưu tin thành công!', 'success');

            router.push('/quan-ly-tin-dang');
        };

        if (isSave && user) {
            if (props.mode === 'create') {
                if (!category) {
                    setIsSave(false);

                    onNotification(
                        'Vui lòng chọn loại hình bất động sản!',
                        'info'
                    );

                    return;
                }

                if (!region) {
                    setIsSave(false);

                    onNotification('Vui lòng chọn Tỉnh/Thành phố!', 'info');

                    return;
                }

                if (!district) {
                    setIsSave(false);

                    onNotification('Vui lòng chọn Quận/Huyện!', 'info');

                    return;
                }

                if (!ward) {
                    setIsSave(false);

                    onNotification('Vui lòng chọn Phường/Xã!', 'info');

                    return;
                }

                if (!title) {
                    setIsSave(false);

                    onNotification('Vui lòng nhập tiêu đề!', 'info');

                    return;
                }

                if (!content) {
                    setIsSave(false);

                    onNotification('Vui lòng nhập nội dung!', 'info');

                    return;
                }

                if (!acreages || isNaN(parseFloat(acreages))) {
                    setIsSave(false);

                    onNotification('Vui lòng nhập diện tích!', 'info');

                    return;
                }

                if (!prices || isNaN(parseFloat(prices))) {
                    setIsSave(false);

                    onNotification('Vui lòng nhập giá tiền!', 'info');

                    return;
                }

                if (images.length < 3) {
                    setIsSave(false);

                    onNotification(
                        'Vui lòng nhập tải tối thiểu 3 hình ảnh!',
                        'info'
                    );

                    return;
                }

                if (ways && isNaN(parseFloat(ways))) {
                    setIsSave(false);

                    onNotification('Vui lòng nhập đúng đường vào!', 'info');

                    return;
                }

                if (facades && isNaN(parseFloat(facades))) {
                    setIsSave(false);

                    onNotification('Vui lòng nhập đúng mặt đường!', 'info');

                    return;
                }

                if (phoneNumber) {
                    const isPhoneNumber = phoneNumber
                        .split(',')
                        .map((item) => item.trim())
                        .reduce((result, item) => {
                            if (result === false) return false;

                            return regexPhoneNumber.test(item);
                        }, true);

                    if (!isPhoneNumber) {
                        setIsSave(false);

                        onNotification(
                            'Vui lòng nhập đúng số điện thoại!',
                            'info'
                        );

                        return;
                    }
                }

                const body: IPostCreate = {
                    type: props.type,
                    title,
                    content,
                    category: category.value as IPostCategory,
                    location: {
                        region: region.value,
                        district: district.value,
                        ward: ward.value,
                        address,
                    },
                    acreages: parseFloat(acreages),
                    prices:
                        parseFloat(prices) * (unit === 'million' ? 1 : 1000),
                    direction: direction
                        ? (direction.value as IPostDirection)
                        : null,
                    legal: legal ? (legal.value as IPostLegal) : null,
                    ways: ways ? parseFloat(ways) : null,
                    facades: facades ? parseFloat(facades) : null,
                    images,
                    poster: {
                        name: contact ? contact : user.fullName,
                        phoneNumber: phoneNumber
                            ? phoneNumber.split(',').map((item) => item.trim())
                            : [user.phoneNumber],
                    },
                    project: null,
                    video: video ? video : null,
                };

                create(controller.signal, body).catch(() => {
                    setIsSave(false);

                    onNotification(
                        'Máy chủ bị lỗi. Vui lòng thử lại!',
                        'danger'
                    );
                });
            } else {
                let poster: Partial<IPoster> | undefined;
                let location:
                    | Partial<Omit<IPostLocation, 'coordinate'>>
                    | undefined;
                let body: IPostUpdateForUser = {};

                if (contact) {
                    poster = { name: contact };
                }

                if (phoneNumber) {
                    for (const phone of phoneNumber.split(',')) {
                        const isPhone = regexPhoneNumber.test(phone.trim());

                        if (!isPhone) {
                            setIsSave(false);

                            onNotification(
                                'Vui lòng nhập đúng số điện thoại!',
                                'info'
                            );

                            return;
                        }
                    }

                    poster = {
                        ...(poster ? poster : {}),
                        phoneNumber: phoneNumber
                            .split(',')
                            .map((item) => item.trim()),
                    };
                }

                if (region) {
                    location = { region: region.value };
                }

                if (district) {
                    location = {
                        ...(location ? location : {}),
                        district: district.value,
                    };
                }

                if (ward) {
                    location = {
                        ...(location ? location : {}),
                        ward: ward.value,
                    };
                }

                if (address) {
                    location = { ...(location ? location : location), address };
                }

                if (poster) {
                    body = { poster };
                }

                if (location) {
                    body = { ...(body ? body : {}), location };
                }

                if (category) {
                    body = {
                        ...(body ? body : {}),
                        category: category.value as IPostCategory,
                    };
                }

                if (title) {
                    body = { ...(body ? body : {}), title };
                }

                if (content) {
                    body = { ...(body ? body : {}), content };
                }

                if (acreages) {
                    if (isNaN(parseFloat(acreages))) {
                        setIsSave(false);

                        onNotification('Vui lòng nhập đúng diện tích!', 'info');

                        return;
                    }

                    body = {
                        ...(body ? body : {}),
                        acreages: parseFloat(acreages),
                    };
                }

                if (prices) {
                    if (isNaN(parseFloat(prices))) {
                        setIsSave(false);

                        onNotification('Vui lòng nhập đúng giá tiền!', 'info');

                        return;
                    }

                    body = {
                        ...(body ? body : {}),
                        prices:
                            parseFloat(prices) *
                            (unit === 'million' ? 1 : 1000),
                    };
                }

                if (direction) {
                    body = {
                        ...(body ? body : {}),
                        direction: direction.value as IPostDirection,
                    };
                }

                if (legal) {
                    body = {
                        ...(body ? body : {}),
                        legal: legal.value as IPostLegal,
                    };
                }

                if (ways) {
                    if (isNaN(parseFloat(ways))) {
                        setIsSave(false);

                        onNotification('Vui lòng nhập đúng đường vào!', 'info');

                        return;
                    }

                    body = { ...(body ? body : {}), ways: parseFloat(ways) };
                }

                if (facades) {
                    if (isNaN(parseFloat(facades))) {
                        setIsSave(false);

                        onNotification('Vui lòng nhập đúng mặt tiền!', 'info');

                        return;
                    }
                    body = {
                        ...(body ? body : {}),
                        facades: parseFloat(facades),
                    };
                }

                if (video) {
                    body = { ...(body ? body : {}), video };
                }

                if (images.length > 0) {
                    body = { ...(body ? body : {}), images };
                }

                if (imagesRemove.length > 0) {
                    body = {
                        ...(body ? body : {}),
                        removeImages: imagesRemove,
                    };
                }

                edit(controller.signal, props.data.postID, body).catch(() => {
                    setIsSave(false);

                    onNotification(
                        'Máy chủ bị lỗi. Vui lòng thử lại!',
                        'danger'
                    );
                });
            }
        } else {
            setIsSave(false);
        }

        return () => controller.abort();
    }, [isSave]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, img: string) => {
            const result = await services.common.images.remove(signal, img);

            if (!result) {
                setImageRemove(undefined);

                onNotification(
                    'Xóa hình ảnh không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            setImageRemove(undefined);
            setImages([...images].filter((item) => item !== img));

            onNotification('Xóa hình ảnh thành công!', 'success');
        };

        if (imageRemove) {
            if (
                props.mode === 'edit' &&
                [...props.data.images].indexOf(imageRemove) >= 0
            ) {
                setImagesRemove((preImages) => [...preImages, imageRemove]);
                setImageRemove(undefined);

                onNotification('Xóa ảnh thành công!', 'success');

                return;
            }

            getData(controller.signal, imageRemove);
        }

        return () => controller.abort();
    }, [imageRemove]);
    useEffect(() => {
        const id = setTimeout(() => {
            if (prices) {
                const value = parseFloat(prices);

                if (value >= 1000 && unit === 'million') {
                    setPrices((value / 1000).toString());
                    setUnit('billion');

                    return;
                }

                if (value < 1 && unit === 'billion') {
                    setPrices((value * 1000).toString());
                    setUnit('million');

                    return;
                }
            }
        }, 100);

        return () => clearTimeout(id);
    }, [unit, prices]);
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal, postID: number) => {
            const result = await services.posts.sold(signal, postID);

            if (!result) throw new Error();

            if (result === 'Unauthorized') {
                setIsSold(false);

                onNotification('Vui lòng đăng nhập', 'warning');

                if (user) {
                    onLogout();
                }

                setIsLogin(true);

                return;
            }

            if (result === 'BadRequest') {
                setIsSold(false);

                onNotification(
                    'Cập nhập trạng thái tin đăng không thành công. Vui lòng thử lại!',
                    'warning'
                );

                return;
            }

            if (result === 'NotFound') {
                setIsSold(false);

                onNotification('Không tìm thấy tin đăng!', 'info');

                router.push('/quan-ly-tin-dang');

                return;
            }

            setIsSold(false);

            onNotification(
                'Cập nhập trạng thái tin đăng thành công!',
                'success'
            );

            router.push('/quan-ly-tin-dang');
        };

        if (isSold && props.mode === 'edit') {
            getData(controller.signal, props.data.postID).catch(() => {
                setIsSold(false);

                onNotification('Máy chủ bị lỗi. Vui lòng thử lại!', 'danger');
            });
        } else {
            setIsSold(false);
        }

        return () => controller.abort();
    }, [isSold]);

    // Handles
    const handleCloseLogin = () => setIsLogin(false);
    const handleReset = () => {
        setDistricts(null);
        setWards(null);
        setCategory(undefined);
        setRegion(undefined);
        setDistrict(undefined);
        setWard(undefined);
        setAddress(undefined);
        setTitle(undefined);
        setContent(undefined);
        setAcreages(undefined);
        setPrices(undefined);
        setUnit('million');
        setLegal(undefined);
        setDirection(undefined);
        setWays(undefined);
        setFacades(undefined);
        setContact(undefined);
        setPhoneNumber(undefined);
        setVideo(undefined);
        setImages([]);
        setImagesRemove([]);
        setImageTemp(undefined);
        setImageSuccess(undefined);
        setStatusImage('normal');
        setProgress(0);
    };

    const handleSelectCategory = (value: SingleValue<ISelect>) => {
        if (value) return setCategory(value);
    };
    const handleSelectRegion = (value: SingleValue<ISelect>) => {
        if (value) return setRegion(value);
    };
    const handleSelectDistrict = (value: SingleValue<ISelect>) => {
        if (value) return setDistrict(value);
    };
    const handleSelectWard = (value: SingleValue<ISelect>) => {
        if (value) return setWard(value);
    };
    const handleSelectLegal = (value: SingleValue<ISelect>) => {
        if (value) return setLegal(value);
    };
    const handleSelectDirection = (value: SingleValue<ISelect>) => {
        if (value) return setDirection(value);
    };
    const handleSelectUnit = (e: EventSelect) =>
        setUnit(e.target.value as 'million' | 'billion');

    const handleChangeTitle = (e: EventInput) => setTitle(e.target.value);
    const handleChangeAddress = (e: EventInput) => setAddress(e.target.value);
    const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setContent(encodeURI(e.target.value));
    const handleChangeAcreages = (e: EventInput) => {
        const { value } = e.target;

        if (isNaN(parseFloat(value))) return setAcreages('');

        setAcreages(value);
    };
    const handleChangePrices = (e: EventInput) => {
        const { value } = e.target;

        if (isNaN(parseFloat(value))) return setPrices('');

        setPrices(value);
    };
    const handleChangeWays = (e: EventInput) => {
        const { value } = e.target;

        if (isNaN(parseFloat(value))) return setWays('');

        setWays(value);
    };
    const handleChangeFacades = (e: EventInput) => {
        const { value } = e.target;

        if (isNaN(parseFloat(value))) return setFacades('');

        setFacades(value);
    };
    const handleChangeContact = (e: EventInput) => setContact(e.target.value);
    const handleChangePhoneNumber = (e: EventInput) =>
        setPhoneNumber(e.target.value);
    const handleChangeVideo = (e: EventInput) => setVideo(e.target.value);
    const handleChangeUpload = (e: EventInput) => {
        if (
            statusImage === 'normal' &&
            !imageTemp &&
            e.target.files &&
            e.target.files.length > 0
        ) {
            const file = e.target.files[0];

            setImageTemp(file);
            setStatusImage('uploading');
        }
    };

    const handleClickUpload = () => {
        if (statusImage === 'normal') return inputRef.current?.click();
    };
    const handleClickSave = () => {
        if (user) return setIsSave(true);

        setIsLogin(true);
    };
    const handleClickRemove = (img: string) => {
        if (!imageRemove) return setImageRemove(img);
    };
    const handleClickSold = () => {
        if (props.mode === 'edit') return setIsSold(true);
    };

    // Validation
    const isDisableButtonModeCreate =
        !category ||
        !region ||
        !district ||
        !ward ||
        !title ||
        !content ||
        !acreages ||
        !prices ||
        images.length < 3;
    const isDisableButtonModeEdit =
        !category &&
        !region &&
        !district &&
        !ward &&
        !address &&
        !title &&
        !content &&
        !acreages &&
        !prices &&
        !legal &&
        !direction &&
        !ways &&
        !facades &&
        !contact &&
        !phoneNumber &&
        !video &&
        !images;
    const validCategory = category
        ? category
        : props.mode === 'edit'
        ? [...SelectCategory].find((item) => item.value === props.data.category)
        : undefined;
    const validRegion = region
        ? region
        : props.mode === 'edit'
        ? [...regions].find((item) => item.value === props.data.location.region)
        : undefined;
    const validDistrict = district
        ? district
        : props.mode === 'edit'
        ? [...(districts ? districts : [])].find(
              (item) => item.value === props.data.location.district
          )
        : undefined;
    const validWard = ward
        ? ward
        : props.mode === 'edit'
        ? [...(wards ? wards : [])].find(
              (item) => item.value === props.data.location.ward
          )
        : undefined;
    const validAddress = address
        ? address
        : props.mode === 'edit'
        ? props.data.location.address.split(', ').slice(0, -3).join(', ')
        : undefined;
    const validTitle = title
        ? title
        : props.mode === 'edit'
        ? props.data.title
        : undefined;
    const validContent = content
        ? decodeURI(content)
        : props.mode === 'edit'
        ? decodeURI(props.data.content)
        : undefined;
    const validAcreages = acreages
        ? acreages
        : props.mode === 'edit'
        ? props.data.acreages.toString()
        : undefined;
    const validPrices = prices
        ? prices
        : props.mode === 'edit'
        ? props.data.prices >= 1000
            ? props.data.prices / 1000
            : props.data.prices
        : undefined;
    const validLegal = legal
        ? legal
        : props.mode === 'edit'
        ? props.data.legal
            ? [...SelectLegal].find((item) => item.value === props.data.legal)
            : undefined
        : undefined;
    const validDirection = direction
        ? direction
        : props.mode === 'edit'
        ? props.data.direction
            ? [...SelectDirection].find(
                  (item) => item.value === props.data.direction
              )
            : undefined
        : undefined;
    const validWays = ways
        ? ways
        : props.mode === 'edit'
        ? props.data.ways
            ? props.data.ways
            : undefined
        : undefined;
    const validFacades = facades
        ? facades
        : props.mode === 'edit'
        ? props.data.facades
            ? props.data.facades
            : undefined
        : undefined;
    const validContact = contact
        ? contact
        : props.mode === 'edit'
        ? props.data.poster.name
        : user
        ? user.fullName
        : undefined;
    const validPhoneNumber = phoneNumber
        ? phoneNumber
        : props.mode === 'edit'
        ? props.data.poster.phoneNumber.join(', ')
        : user
        ? user.phoneNumber
        : undefined;
    const validVideo = video
        ? video
        : props.mode === 'edit'
        ? props.data.video
            ? props.data.video
            : undefined
        : undefined;
    const validImages = [
        ...(props.mode === 'edit' ? props.data.images : []),
        ...images,
    ].filter((item) => imagesRemove.indexOf(item) === -1);

    return (
        <>
            <div className={Styles.box}>
                <div className={classNames(Styles.title, 'mb-2')}>
                    Thông tin cơ bản
                </div>
                <Form className='mb-2'>
                    <Select
                        options={SelectCategory}
                        placeholder='Loại hình'
                        onChange={handleSelectCategory}
                        value={validCategory}
                    />
                </Form>
                <Form className='mb-2'>
                    <Form.Label>Địa chỉ</Form.Label>
                    <Select
                        className='mb-2'
                        options={regions}
                        placeholder='Tỉnh/Thành phố'
                        value={validRegion}
                        onChange={handleSelectRegion}
                    />
                    <Row>
                        <Col md={6} className='mb-2'>
                            <Select
                                options={districts ? districts : []}
                                placeholder='Quận/Huyện'
                                isDisabled={!districts}
                                value={validDistrict}
                                onChange={handleSelectDistrict}
                            />
                        </Col>
                        <Col md={6} className='mb-2'>
                            <Select
                                options={wards ? wards : []}
                                placeholder='Phường/Xã'
                                isDisabled={!wards}
                                onChange={handleSelectWard}
                                value={validWard}
                            />
                        </Col>
                    </Row>
                    <Form.Control
                        placeholder='Địa chỉ bổ sung: Số nhà, Ngõ, Ngách, Đường'
                        value={validAddress}
                        onChange={handleChangeAddress}
                    />
                </Form>
            </div>
            <div className={Styles.box}>
                <div className={classNames('mb-2', Styles.title)}>
                    Thông tin bài viết
                </div>
                <Form className='mb-2'>
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control
                        as='textarea'
                        placeholder='Tiêu đề...'
                        value={validTitle}
                        onChange={handleChangeTitle}
                    />
                </Form>
                <Form className='mb-4'>
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                        as='textarea'
                        placeholder='Mô tả...'
                        value={validContent}
                        onChange={handleChangeContent}
                    />
                </Form>
            </div>
            <div className={Styles.box}>
                <div className={Styles.title}>Thông tin bất động sản</div>
                <Form className='mb-2'>
                    <Form.Label>Diện tích</Form.Label>
                    <Form.Control
                        type='number'
                        value={validAcreages}
                        onChange={handleChangeAcreages}
                    />
                </Form>
                <Form className='mb-2'>
                    <Form.Label>Mức giá</Form.Label>
                    <Row>
                        <Col lg={8}>
                            <Form.Control
                                value={validPrices}
                                onChange={handleChangePrices}
                            />
                        </Col>
                        <Col lg={4}>
                            <Form.Select
                                value={unit}
                                onChange={handleSelectUnit}
                            >
                                <option value='million'>Triệu</option>
                                <option value='billion'>Tỷ</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Form>
                <Row className='flex-wrap'>
                    <Col md={6} className='mb-2'>
                        <Form.Label>Giấy tờ pháp lý</Form.Label>
                        <Select
                            options={SelectLegal}
                            placeholder='Vui lòng chọn'
                            value={validLegal}
                            onChange={handleSelectLegal}
                        />
                    </Col>
                    <Col md={6} className='mb-2'>
                        <Form.Label>Hướng nhà</Form.Label>
                        <Select
                            options={SelectDirection}
                            placeholder='Vui lòng chọn'
                            value={validDirection}
                            onChange={handleSelectDirection}
                        />
                    </Col>
                    <Col lg={6} className='mb-2'>
                        <Form>
                            <Form.Label>Đường vào</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    placeholder='Nhập số'
                                    type='number'
                                    value={validWays}
                                    onChange={handleChangeWays}
                                />
                                <InputGroup.Text>m</InputGroup.Text>
                            </InputGroup>
                        </Form>
                    </Col>
                    <Col lg={6} className='mb-2'>
                        <Form>
                            <Form.Label>Mặt tiền</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    placeholder='Nhập số'
                                    type='number'
                                    value={validFacades}
                                    onChange={handleChangeFacades}
                                />
                                <InputGroup.Text>m</InputGroup.Text>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>
            </div>
            <div className={Styles.box}>
                <div className={Styles.title}>Thông tin liên hệ</div>
                <Form className='mb-2'>
                    <Form.Label>Tên liên hệ</Form.Label>
                    <Form.Control
                        value={validContact}
                        onChange={handleChangeContact}
                    />
                </Form>
                <Form className='mb-2'>
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        value={validPhoneNumber}
                        onChange={handleChangePhoneNumber}
                    />
                    <Form.Text>Mỗi số cách nhau dấu phẩy</Form.Text>
                </Form>
            </div>
            <div className={Styles.box}>
                <div className={Styles.title}>Hỉnh ảnh & Video</div>
                <Form.Control
                    className='mb-2'
                    placeholder='Nhập link video youtube'
                    value={validVideo}
                    onChange={handleChangeVideo}
                />
                <input
                    type='file'
                    style={{ display: 'none' }}
                    ref={inputRef}
                    onChange={handleChangeUpload}
                />
                <button
                    className={Styles.upload}
                    disabled={statusImage !== 'normal'}
                    onClick={handleClickUpload}
                >
                    <i className='material-icons-outlined'>
                        {statusImage === 'normal'
                            ? 'file_download'
                            : statusImage === 'uploading'
                            ? 'cloud_sync'
                            : statusImage === 'failed'
                            ? 'cloud_off'
                            : 'cloud_done'}
                    </i>
                    {statusImage === 'normal' && (
                        <>
                            <p>Bấm để chọn ảnh cần tải lên</p>
                            <span>Dung lượng ảnh tối đa 10mb</span>
                        </>
                    )}
                    {statusImage === 'uploading' && (
                        <ProgressBar now={progress} />
                    )}
                </button>
                <Row className='mt-4 flex-wrap'>
                    {validImages.map((item, index) => (
                        <Col lg={4} className='my-2' key={item}>
                            <div className={Styles.img}>
                                <img
                                    src={`/${
                                        [...images].indexOf(item) === -1
                                            ? 'images/posts'
                                            : 'temp'
                                    }/${item}`}
                                    alt='Image'
                                />
                                {index === 0 && <p>Ảnh đại diện</p>}
                                {imageRemove && imageRemove === item ? (
                                    <div className={Styles.img_remove}>
                                        <Spinner variant='light' />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleClickRemove(item)}
                                        disabled={imageRemove !== undefined}
                                    >
                                        <i className='material-icons-outlined'>
                                            delete
                                        </i>
                                    </button>
                                )}
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
            <div className={Styles.post}>
                <Button
                    variant='primary'
                    disabled={
                        (props.mode === 'create'
                            ? isDisableButtonModeCreate
                            : isDisableButtonModeEdit) || isSold
                    }
                    onClick={handleClickSave}
                    className='mx-2'
                >
                    {isSave && user ? (
                        <Spinner />
                    ) : !user ? (
                        'Đăng nhập để tiếp tục'
                    ) : props.mode === 'create' ? (
                        'Đăng tin'
                    ) : (
                        'Lưu tin'
                    )}
                </Button>
                {props.mode === 'edit' && (
                    <Button
                        variant='danger'
                        className='mx-2'
                        disabled={isSave || isSold}
                        onClick={handleClickSold}
                    >
                        {isSold ? <Spinner /> : 'Đã bán'}
                    </Button>
                )}
            </div>
            {isLogin && <LoginComponent.Web onClose={handleCloseLogin} />}
        </>
    );
};

export default Index;
