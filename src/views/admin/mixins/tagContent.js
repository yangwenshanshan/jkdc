export const tagContent = {
    data() {
        return {
            tagContent: []
        }
    },
    methods: {
        async getTagContent() {
            const { sentence: res } = await this.request(
                'regulationsLabel/getMatchingList',
                {},
                'GET'
            )

            this.tagContent = res
        },
    }
}