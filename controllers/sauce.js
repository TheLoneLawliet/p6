const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');


exports.newSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');

    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'sauce added successfully'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )

}

exports.getAllSauces = (req, res, next) => {

    Sauce.find().then((sauces) => {
        res.status(200).json(sauces);
    }).catch(
        (error) => {
            res.status(400).json(
                { error: error }
            )
        }
    );
};

exports.getOneSauce = (req, res, next) => {


    Sauce.findOne({ _id: req.params.id }).then(

        (sauce) => { res.status(200).json(sauce) }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            })
        }
    )
}


exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            if (!sauce) {
                return res.status(404).json({
                    error: new Error('Sauce not found!')
                });
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({
                    error: new Error('You are not authorized to make this request!')
                });
            }



            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({ _id: req.params.id }).then(
                    () => {
                        res.status(201).json({
                            message: 'Deleted'
                        })
                    }
                ).catch((error) => {
                    res.status(401).json({
                        error: error
                    })
                })
            })
        }

    )
}

exports.editOneSauce = (req, res, next) => {
    console.log('.... editing ....')
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {
        Sauce.findOne({ _id: req.params.id }).then(
            (sauce) => {
                const oldFilename = sauce.imageUrl.split('/images/')[1];
                fs.unlink('images/' + oldFilename, () => {
                    console.log('old file removed')
                })
            }
        )
        req.body.sauce = JSON.parse(req.body.sauce);
        const url = req.protocol + '://' + req.get('host');
        sauce = {
            _id: req.params.id,
            userId: req.body.sauce.userId,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat
        }
    }

    else {
        sauce = {
            _id: req.params.id,
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.url,
            heat: req.body.heat
        }

    }

    Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
            res.status(201).json({
                message: 'updated successfully'
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({ error: error })
        }
    )

}

exports.likes = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            let hasLiked = sauce.usersLiked.some(usr => usr === req.body.userId);
            let hasDisliked = sauce.usersDisliked.some(usr => usr === req.body.userId);



            let currLikes = sauce.usersLiked.length;
            let currDisikes = sauce.usersDisliked.length;

            let react = req.body.like;

            if (react === 1) {

                if (hasLiked) {
                    return res.status(401).json({
                        error: new Error('User already liked post')
                    })
                }

                Sauce.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $push: { usersLiked: req.body.userId },
                        likes: currLikes + 1
                    }
                ).then(() => {
                    res.status(201).json({ message: 'Liked' })
                }).catch((error) => {
                    res.status(400).json({ error: error });
                });
            }
            if (react === -1) {

                if (hasDisliked) {
                    return res.status(401).json({
                        error: new Error('User already disliked post')
                    })
                }

                Sauce.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $push: { usersDisliked: req.body.userId },
                        dislikes: currDisikes + 1
                    }
                ).then(() => {
                    res.status(201).json({ message: 'Disliked' })
                }).catch((error) => {
                    res.status(400).json({ error: error });
                });

            }


            if (react === 0) {
                if (hasLiked) {
                    Sauce.findOneAndUpdate(
                        { _id: req.params.id },
                        {
                            $pull: { usersLiked: req.body.userId },
                            likes: currLikes - 1
                        }
                    ).then(() => {
                        res.status(201).json({ message: 'Like Removed' })
                    }).catch((error) => {
                        res.status(400).json({ error: error });
                    });
                }
                if (hasDisliked) {
                    Sauce.findOneAndUpdate(
                        { _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId },
                            dislikes: currDisikes - 1
                        }
                    ).then(() => {
                        res.status(201).json({ message: 'Dislike Removed' })
                    }).catch((error) => {
                        res.status(400).json({ error: error });
                    });

                }
            }
        }

    )
}
