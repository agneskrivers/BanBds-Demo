// @ts-check
/**
 * @type {import('next').NextConfig}
 **/

module.exports = {
    async rewrites() {
        return [
            {
                source: '/chinh-sach-bao-mat',
                destination: '/privacy',
            },
            {
                source: '/dieu-khoan-thoa-thuan',
                destination: '/terms',
            },
            {
                source: '/giai-quyet-khieu-nai',
                destination: '/complaints',
            },
            // Posts Search
            {
                source: '/:type(ban|cho-thue)-:category',
                destination: '/posts',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/:type(ban|cho-thue)-:category/:queryType(gia|dien-tich)-:queryValueType(tu|tren|duoi)-:queryValue',
                destination: '/posts',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/:type(ban|cho-thue)-:category/:region',
                destination: '/posts',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/:type(ban|cho-thue)-:category/:region/:queryType(gia|dien-tich)-:queryValueType(tu|tren|duoi)-:queryValue',
                destination: '/posts',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/:type(ban|cho-thue)-:category/:region/:district',
                destination: '/posts',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/:type(ban|cho-thue)-:category/:region/:district/:queryType(gia|dien-tich)-:queryValueType(tu|tren|duoi)-:queryValue',
                destination: '/posts',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            // Posts
            {
                source: '/:type(ban|cho-thue)-:category',
                destination: '/posts',
            },
            {
                source: '/:type(ban|cho-thue)-:category/:queryType(gia|dien-tich)-:queryValueType(tu|tren|duoi)-:queryValue',
                destination: '/posts',
            },
            {
                source: '/:type(ban|cho-thue)-:category/:region',
                destination: '/posts',
            },
            {
                source: '/:type(ban|cho-thue)-:category/:region/:queryType(gia|dien-tich)-:queryValueType(tu|tren|duoi)-:queryValue',
                destination: '/posts',
            },
            {
                source: '/:type(ban|cho-thue)-:category/:region/:district',
                destination: '/posts',
            },
            {
                source: '/:type(ban|cho-thue)-:category/:region/:district/:queryType(gia|dien-tich)-:queryValueType(tu|tren|duoi)-:queryValue',
                destination: '/posts',
            },
            {
                source: '/tin-dang/:title',
                destination: '/posts/:title',
            },
            // Projects Search
            {
                source: '/du-an-:type',
                destination: '/projects',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/du-an-:type/gia-:pricesQuery(tu|tren|duoi)-:prices',
                destination: '/projects',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/du-an-:type/:region',
                destination: '/projects',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/du-an-:type/:region/gia-:pricesQuery(tu|tren|duoi)-:prices',
                destination: '/projects',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/du-an-:type/:region/:district',
                destination: '/projects',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            {
                source: '/du-an-:type/:region/:district/gia-:pricesQuery(tu|tren|duoi)-:prices',
                destination: '/projects',
                has: [
                    {
                        type: 'query',
                        key: 's',
                    },
                ],
            },
            // Projects
            {
                source: '/du-an-:type',
                destination: '/projects',
            },
            {
                source: '/du-an-:type/gia-:pricesQuery(tu|tren|duoi)-:prices',
                destination: '/projects',
            },
            {
                source: '/du-an-:type/:region',
                destination: '/projects',
            },
            {
                source: '/du-an-:type/:region/gia-:pricesQuery(tu|tren|duoi)-:prices',
                destination: '/projects',
            },
            {
                source: '/du-an-:type/:region/:district',
                destination: '/projects',
            },
            {
                source: '/du-an-:type/:region/:district/gia-:pricesQuery(tu|tren|duoi)-:prices',
                destination: '/projects',
            },
            {
                source: '/du-an/:title',
                destination: '/projects/:title',
            },
            // Form
            {
                source: '/dang-tin',
                destination: '/form',
            },
            // News
            {
                source: '/tin-tuc',
                destination: '/news',
            },
            {
                source: '/tin-tuc/:title',
                destination: '/news/:title',
            },
            {
                source: '/thong-tin-ca-nhan',
                destination: '/profile',
            },
            {
                source: '/quan-ly-tin-dang',
                destination: '/myPosts',
            },
            {
                source: '/quan-ly-tin-dang/:postID',
                destination: '/myPosts/:postID',
            },
        ];
    },
    poweredByHeader: false,
};
