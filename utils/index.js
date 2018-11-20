
exports.createRef = (rows, colName, idName) => {
    return rows.reduce((refObj, row) => {
        const rowVal = row[colName];
        const key = row[idName];
        refObj[rowVal] = key;
        return refObj;
    }, {});
};

exports.formatArticle = (artData, usersRef) => {
    return artData.map(artDatum => {
        const { title, topic, created_by, body, created_at } = artDatum;
        const time = new Date(created_at);
        return {
            title,
            topic,
            user_id: usersRef[created_by],
            body,
            created_at: time
        };
    });
};

exports.formatComments = (comData, ref) => {
    return comData.map(comDatum => {
        const { body, belongs_to, created_by, votes, created_at } = comDatum;
        const time = new Date(created_at);
        if (ref[belongs_to]) {
            return {
                body,
                article_id: ref[belongs_to],
                user_id: undefined,
                votes,
                created_at: time
            };
        } else {
            return {
                body,
                article_id,
                user_id: ref[created_by],
                votes,
                created_at: time
            }
        }
    });
};