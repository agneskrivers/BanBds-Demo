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
                    onNotification('C?? l???i x???y ra!', 'warning');

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
                onNotification('M??y ch??? b??? l???i!', 'danger');
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
                    'L???y danh s??ch Qu???n/Huy???n kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
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

                onNotification('M??y ch??? b??? l???i. Vui l??ng th??? l???i!');
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
                    'L???y danh s??ch Ph?????ng/X?? kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
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

                onNotification('M??y ch??? b??? l???i. Vui l??ng th??? l???i!');
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
                    '?????nh d???ng ???nh kh??ng h??? tr???. Vui l??ng ch???n l???i!',
                    'warning'
                );

                return;
            }

            if (result === 'ImageToBig') {
                setStatusImage('normal');
                setProgress(0);
                setImageTemp(undefined);

                onNotification(
                    'Dung l?????ng ???nh qu?? l???n. Vui l??ng ch???n ???nh kh??c!',
                    'warning'
                );

                return;
            }

            if (result === 'NotFound') {
                setStatusImage('normal');
                setProgress(0);
                setImageTemp(undefined);

                onNotification(
                    'Kh??ng c?? h???nh ???nh. Vui l??ng th??? l???i!',
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

                onNotification('M??y ch??? b??? l???i. Vui l??ng th??? l???i!');
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
            onNotification('T???i ???nh th??nh c??ng!', 'success');

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
                    'T???o tin ????ng kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            if (result === 'Unauthorized') {
                setIsSave(false);

                onNotification('Vui l??ng ????ng nh???p', 'warning');

                if (user) {
                    onLogout();
                }

                setIsLogin(true);

                return;
            }

            setIsSave(false);
            handleReset();
            onNotification('????ng tin th??nh c??ng', 'success');
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

                onNotification('Vui l??ng ????ng nh???p', 'warning');

                if (user) {
                    onLogout();
                }

                setIsLogin(true);

                return;
            }

            if (result === 'BadRequest') {
                setIsSave(false);

                onNotification(
                    'L??u tin ????ng kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            if (result === 'NotFound') {
                setIsSave(false);

                onNotification('Kh??ng t??m th???y tin ????ng!', 'info');

                router.push('/quan-ly-tin-dang');

                return;
            }

            if (result !== true) {
                setIsSave(false);

                onNotification(
                    'L??u tin ????ng kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            setIsSave(false);
            handleReset();

            onNotification('L??u tin th??nh c??ng!', 'success');

            router.push('/quan-ly-tin-dang');
        };

        if (isSave && user) {
            if (props.mode === 'create') {
                if (!category) {
                    setIsSave(false);

                    onNotification(
                        'Vui l??ng ch???n lo???i h??nh b???t ?????ng s???n!',
                        'info'
                    );

                    return;
                }

                if (!region) {
                    setIsSave(false);

                    onNotification('Vui l??ng ch???n T???nh/Th??nh ph???!', 'info');

                    return;
                }

                if (!district) {
                    setIsSave(false);

                    onNotification('Vui l??ng ch???n Qu???n/Huy???n!', 'info');

                    return;
                }

                if (!ward) {
                    setIsSave(false);

                    onNotification('Vui l??ng ch???n Ph?????ng/X??!', 'info');

                    return;
                }

                if (!title) {
                    setIsSave(false);

                    onNotification('Vui l??ng nh???p ti??u ?????!', 'info');

                    return;
                }

                if (!content) {
                    setIsSave(false);

                    onNotification('Vui l??ng nh???p n???i dung!', 'info');

                    return;
                }

                if (!acreages || isNaN(parseFloat(acreages))) {
                    setIsSave(false);

                    onNotification('Vui l??ng nh???p di???n t??ch!', 'info');

                    return;
                }

                if (!prices || isNaN(parseFloat(prices))) {
                    setIsSave(false);

                    onNotification('Vui l??ng nh???p gi?? ti???n!', 'info');

                    return;
                }

                if (images.length < 3) {
                    setIsSave(false);

                    onNotification(
                        'Vui l??ng nh???p t???i t???i thi???u 3 h??nh ???nh!',
                        'info'
                    );

                    return;
                }

                if (ways && isNaN(parseFloat(ways))) {
                    setIsSave(false);

                    onNotification('Vui l??ng nh???p ????ng ???????ng v??o!', 'info');

                    return;
                }

                if (facades && isNaN(parseFloat(facades))) {
                    setIsSave(false);

                    onNotification('Vui l??ng nh???p ????ng m???t ???????ng!', 'info');

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
                            'Vui l??ng nh???p ????ng s??? ??i???n tho???i!',
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
                        'M??y ch??? b??? l???i. Vui l??ng th??? l???i!',
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
                                'Vui l??ng nh???p ????ng s??? ??i???n tho???i!',
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

                        onNotification('Vui l??ng nh???p ????ng di???n t??ch!', 'info');

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

                        onNotification('Vui l??ng nh???p ????ng gi?? ti???n!', 'info');

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

                        onNotification('Vui l??ng nh???p ????ng ???????ng v??o!', 'info');

                        return;
                    }

                    body = { ...(body ? body : {}), ways: parseFloat(ways) };
                }

                if (facades) {
                    if (isNaN(parseFloat(facades))) {
                        setIsSave(false);

                        onNotification('Vui l??ng nh???p ????ng m???t ti???n!', 'info');

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
                        'M??y ch??? b??? l???i. Vui l??ng th??? l???i!',
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
                    'X??a h??nh ???nh kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            setImageRemove(undefined);
            setImages([...images].filter((item) => item !== img));

            onNotification('X??a h??nh ???nh th??nh c??ng!', 'success');
        };

        if (imageRemove) {
            if (
                props.mode === 'edit' &&
                [...props.data.images].indexOf(imageRemove) >= 0
            ) {
                setImagesRemove((preImages) => [...preImages, imageRemove]);
                setImageRemove(undefined);

                onNotification('X??a ???nh th??nh c??ng!', 'success');

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

                onNotification('Vui l??ng ????ng nh???p', 'warning');

                if (user) {
                    onLogout();
                }

                setIsLogin(true);

                return;
            }

            if (result === 'BadRequest') {
                setIsSold(false);

                onNotification(
                    'C???p nh???p tr???ng th??i tin ????ng kh??ng th??nh c??ng. Vui l??ng th??? l???i!',
                    'warning'
                );

                return;
            }

            if (result === 'NotFound') {
                setIsSold(false);

                onNotification('Kh??ng t??m th???y tin ????ng!', 'info');

                router.push('/quan-ly-tin-dang');

                return;
            }

            setIsSold(false);

            onNotification(
                'C???p nh???p tr???ng th??i tin ????ng th??nh c??ng!',
                'success'
            );

            router.push('/quan-ly-tin-dang');
        };

        if (isSold && props.mode === 'edit') {
            getData(controller.signal, props.data.postID).catch(() => {
                setIsSold(false);

                onNotification('M??y ch??? b??? l???i. Vui l??ng th??? l???i!', 'danger');
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
                    Th??ng tin c?? b???n
                </div>
                <Form className='mb-2'>
                    <Select
                        options={SelectCategory}
                        placeholder='Lo???i h??nh'
                        onChange={handleSelectCategory}
                        value={validCategory}
                    />
                </Form>
                <Form className='mb-2'>
                    <Form.Label>?????a ch???</Form.Label>
                    <Select
                        className='mb-2'
                        options={regions}
                        placeholder='T???nh/Th??nh ph???'
                        value={validRegion}
                        onChange={handleSelectRegion}
                    />
                    <Row>
                        <Col md={6} className='mb-2'>
                            <Select
                                options={districts ? districts : []}
                                placeholder='Qu???n/Huy???n'
                                isDisabled={!districts}
                                value={validDistrict}
                                onChange={handleSelectDistrict}
                            />
                        </Col>
                        <Col md={6} className='mb-2'>
                            <Select
                                options={wards ? wards : []}
                                placeholder='Ph?????ng/X??'
                                isDisabled={!wards}
                                onChange={handleSelectWard}
                                value={validWard}
                            />
                        </Col>
                    </Row>
                    <Form.Control
                        placeholder='?????a ch??? b??? sung: S??? nh??, Ng??, Ng??ch, ???????ng'
                        value={validAddress}
                        onChange={handleChangeAddress}
                    />
                </Form>
            </div>
            <div className={Styles.box}>
                <div className={classNames('mb-2', Styles.title)}>
                    Th??ng tin b??i vi???t
                </div>
                <Form className='mb-2'>
                    <Form.Label>Ti??u ?????</Form.Label>
                    <Form.Control
                        as='textarea'
                        placeholder='Ti??u ?????...'
                        value={validTitle}
                        onChange={handleChangeTitle}
                    />
                </Form>
                <Form className='mb-4'>
                    <Form.Label>M?? t???</Form.Label>
                    <Form.Control
                        as='textarea'
                        placeholder='M?? t???...'
                        value={validContent}
                        onChange={handleChangeContent}
                    />
                </Form>
            </div>
            <div className={Styles.box}>
                <div className={Styles.title}>Th??ng tin b???t ?????ng s???n</div>
                <Form className='mb-2'>
                    <Form.Label>Di???n t??ch</Form.Label>
                    <Form.Control
                        type='number'
                        value={validAcreages}
                        onChange={handleChangeAcreages}
                    />
                </Form>
                <Form className='mb-2'>
                    <Form.Label>M???c gi??</Form.Label>
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
                                <option value='million'>Tri???u</option>
                                <option value='billion'>T???</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Form>
                <Row className='flex-wrap'>
                    <Col md={6} className='mb-2'>
                        <Form.Label>Gi???y t??? ph??p l??</Form.Label>
                        <Select
                            options={SelectLegal}
                            placeholder='Vui l??ng ch???n'
                            value={validLegal}
                            onChange={handleSelectLegal}
                        />
                    </Col>
                    <Col md={6} className='mb-2'>
                        <Form.Label>H?????ng nh??</Form.Label>
                        <Select
                            options={SelectDirection}
                            placeholder='Vui l??ng ch???n'
                            value={validDirection}
                            onChange={handleSelectDirection}
                        />
                    </Col>
                    <Col lg={6} className='mb-2'>
                        <Form>
                            <Form.Label>???????ng v??o</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    placeholder='Nh???p s???'
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
                            <Form.Label>M???t ti???n</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    placeholder='Nh???p s???'
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
                <div className={Styles.title}>Th??ng tin li??n h???</div>
                <Form className='mb-2'>
                    <Form.Label>T??n li??n h???</Form.Label>
                    <Form.Control
                        value={validContact}
                        onChange={handleChangeContact}
                    />
                </Form>
                <Form className='mb-2'>
                    <Form.Label>S??? ??i???n tho???i</Form.Label>
                    <Form.Control
                        value={validPhoneNumber}
                        onChange={handleChangePhoneNumber}
                    />
                    <Form.Text>M???i s??? c??ch nhau d???u ph???y</Form.Text>
                </Form>
            </div>
            <div className={Styles.box}>
                <div className={Styles.title}>H???nh ???nh & Video</div>
                <Form.Control
                    className='mb-2'
                    placeholder='Nh???p link video youtube'
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
                            <p>B???m ????? ch???n ???nh c???n t???i l??n</p>
                            <span>Dung l?????ng ???nh t???i ??a 10mb</span>
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
                                {index === 0 && <p>???nh ?????i di???n</p>}
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
                        '????ng nh???p ????? ti???p t???c'
                    ) : props.mode === 'create' ? (
                        '????ng tin'
                    ) : (
                        'L??u tin'
                    )}
                </Button>
                {props.mode === 'edit' && (
                    <Button
                        variant='danger'
                        className='mx-2'
                        disabled={isSave || isSold}
                        onClick={handleClickSold}
                    >
                        {isSold ? <Spinner /> : '???? b??n'}
                    </Button>
                )}
            </div>
            {isLogin && <LoginComponent.Web onClose={handleCloseLogin} />}
        </>
    );
};

export default Index;
