const utils = require("../utils");
const AWS = require("aws-sdk");

const awsConfig = {
    region: process.env.AWS_DYNAMO_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}
AWS.config.update(awsConfig);

const dbClient = new AWS.DynamoDB.DocumentClient({endpoint: process.env.AWS_DYNAMO_ENDPOINT});

module.exports = {
    handleErrors: (error, req, res, next) => {
        console.log("Error Handling : ", error)
        if (res.headersSent) {
            return next(error);
        }
        res.status(500).json({
            message: "Une erreur serveur interne est survenue"
        })
    },
    verifyCookie: (req, res, next) => {
        const egenumCookie = req.cookies.egenum;
        const egenumCookieValue =  egenumCookie === undefined ? { id: undefined } : JSON.parse(egenumCookie)

        if(egenumCookieValue.id !== undefined) {
            next();
        }
        else {
            res.redirect("/login")
        }
    },
    verifyUser: (req, res, next) => {
        try {
            const userID = JSON.parse(req.cookies.egenum).id
            dbClient.get({
                TableName: 'egenum-users',
                Key: {
                    id: userID
                }
            }, (error, data) => {
                if(error) {
                    console.log("Error while getting user in DB :", error);
                    res.status(500).json({
                        status: 500,
                        statusStr: "Internal Server Error",
                        msg: "Impossible de vérifier l'émetteur de la requête"
                    })
                }
                else {
                    if(data.Item) {
                        next();
                    }
                    else {
                        res.status(401).json({
                            status: 401,
                            statusStr: "Unauthorized",
                            msg: "Vous devez être connecté pour effectuer cette opération"
                        })
                    }
                }
            })
        } catch (error) {
            console.log("Error while verifying user:", error);
            res.status(500).json({
                status: 500,
                statusStr: "Internal Server Error",
                msg: "Impossible de vérifier l'émetteur de la requête"
            })
        }
    },
    verifyUserBeta: async (req, res, next) => {
        try {
            const userID = JSON.parse(req.cookies.egenum).id
            try {
                var data = await dbClient.get({
                    TableName: 'egenum-users',
                    Key: {
                        id: userID
                    }
                }).promise()
                console.log("DATA : ", data)
                if(data.Item) {
                    next();
                }
                else {
                    res.status(401).json({
                        status: 401,
                        statusStr: "Unauthorized",
                        msg: "Vous devez être connecté pour effectuer cette opération"
                    })
                }
            } catch (error) {
                console.log("Error while getting user in DB :", error);
                res.status(500).json({
                    status: 500,
                    statusStr: "Internal Server Error",
                    msg: "Impossible de vérifier l'émetteur de la requête"
                })
            }

        } catch (error) {
            console.log("Error while verifying user:", error);
            res.status(500).json({
                status: 500,
                statusStr: "Internal Server Error",
                msg: "Impossible de vérifier l'émetteur de la requête"
            })
        }
    },
    authenticate: (req, res, next) => {
        try {
            dbClient.scan({
                TableName: "egenum-users",
                FilterExpression: "username= :username",
                ExpressionAttributeValues: {
                    ":username": req.body.userName
                }
            }, (error, data) => {
                if(error) {
                    console.log("Error with userName")
                    console.log("Error: ", error)
                    req.user_data = {};
                    req.user_errors = {
                        serveur: {
                            msg: "Une erreur serveur interne est survenue"
                        }
                    };
                    next();
                }
                else {
                    if(data.Count !== 1) {
                        console.log("Utilisateur introuvable")
                        req.user_data = {};
                        req.user_errors = {
                            userName: {
                                msg: "Le nom d'utilisateur est invalide !"
                            }
                        };
                        next();
                    }
                    else {
                        dbClient.scan({
                            TableName: "egenum-users",
                            FilterExpression: "username= :username AND password= :password",
                            ExpressionAttributeValues: {
                                ":username": req.body.userName,
                                ":password": utils.hashPassword(req.body.password)
                            }
                        }, (error, data) => {
                            if(error) {
                                console.log("Error with password")
                                console.log("Error: ", error)
                                req.user_data = {};
                                req.user_errors = {
                                    serveur: {
                                        msg: "Une erreur serveur interne est survenue"
                                    }
                                };
                                next();
                            }
                            else {
                                if(data.Count === 0) {
                                    console.log("Combinaison utilisateur/mot de passe introuvable")
                                    req.user_data = {};
                                    req.user_errors = {
                                        password: {
                                            msg: "Le mot de passe est invalide !"
                                        }
                                    };
                                    next();
                                }
                                else if (data.Count === 1) {
                                    // console.log("Authentifié")
                                    req.user_data = {
                                        id: data.Items[0].id,
                                        userName: data.Items[0].username
                                    };
                                    req.user_errors = {};
                                    next();
                                }
                            }
                        })
                    }
                }
            })
        } catch (error) {
            console.log("Error: ", error)
            req.user_data = {};
            req.user_errors = {
                serveur: {
                    msg: "Une erreur serveur interne est survenue"
                }
            };
            next();
        }
    },
    createService: (req, res, next) => {
        try {

            processPhone = function(number) {
                let correctPhoneNumber = number.trim().replace(/\s|\./g, "").replace("+33", "0")
                return correctPhoneNumber;
            }

            var body = req.body;
            const newObject = {
                id: utils.createID(),
                createdAt: new Date().toLocaleString(),
                createdBy: JSON.parse(req.cookies.egenum).userName,
                categories: body.categories,
                name: body.nom,
                contact: {
                    mail: body.email,
                    phone: processPhone(body.phone)
                },
                address: {
                    number: body.numero,
                    street: body.voie,
                    city: body.ville,
                    zip: body.codeP,
                    coords: {
                        lat: body.latitude,
                        lng: body.longitude
                    },
                },
                hours: {
                    monday: {
                        isClosed: body.lundi_isClosed || false, 
                        value: body.lundi_hours
                    },
                    tuesday: {
                        isClosed: body.mardi_isClosed || false, 
                        value: body.mardi_hours
                    },
                    wednesday: {
                        isClosed: body.mercredi_isClosed || false, 
                        value: body.mercredi_hours
                    },
                    thursday: {
                        isClosed: body.jeudi_isClosed || false, 
                        value: body.jeudi_hours
                    },
                    friday: {
                        isClosed: body.vendredi_isClosed || false, 
                        value: body.vendredi_hours
                    },
                    saturday: {
                        isClosed: body.samedi_isClosed || false, 
                        value: body.samedi_hours
                    },
                    sunday: {
                        isClosed: body.dimanche_isClosed || false, 
                        value: body.dimanche_hours
                    }
                },
                website: body.website
            }

            dbClient.put({
                TableName: "egenum-services",
                Item: newObject
            }, (error, data) => {
                if(error) {
                    req.service_result = false
                    next();
                }
                else {
                    req.service_result = true
                    next();
                }
            })

        } catch (error) {
            next(error);
        }
    },
    getAllServices: (req, res, next) => {
        try {
            dbClient.scan({
                TableName: 'egenum-services'
            }, (error, data) => {
                if(error) {
                    console.log("Error while fetching services !")
                    console.log("Error: ", error)
                    req.service_data = {};
                    req.service_error = {
                        serveur: {
                            msg: "Une erreur serveur interne est survenue"
                        }
                    };
                    next();
                }
                else {
                    if(data.Count === 0) {
                        console.log("Aucun services trouvés")
                        req.service_data = {};
                        req.service_error = {
                            service: {
                                msg: "Aucun services"
                            }
                        };
                        next();
                    }
                    else {
                        console.log("Services récupérés")
                        req.service_data = {
                            count: data.Count,
                            items: data.Items
                        }
                        req.service_error = {};
                        next();
                    }
                }
            })
        } catch (error) {
            console.log("Error: ", error)
            req.service_data = {};
            req.service_error = {
                serveur: {
                    msg: "Une erreur serveur interne est survenue"
                }
            };
            next();
        }
    },
    removeService: (req, res, next) => {
        try {
            dbClient.delete({
                TableName: "egenum-services",
                Key: {
                    id: req.params.id
                }
            }, (error, data) => {
                if(error) {
                    console.log("Error on DELETE service");
                    res.status(500).json({
                        status: 500
                    })
                }
                else {
                    res.status(200).json({
                        status: 200
                    })
                }
            })
        } catch (error) {
            next(error)
        }
    }

    /*********************/
    /**SUPER ADMIN Only */
    /** createUser: (req, res, next) => {

        dbClient.scan({
            TableName: 'egenum-users',
            FilterExpression: "username= :username",
            ExpressionAttributeValues: {
                ":username": req.body.userName
            }
        }, (error, data) => {
            if(error) {
                next(error);
            }
            else {
                // console.log("Data:", data)
                if(data.Count !== 0) {
                    res.status(403).json({
                        status: 403,
                        statusStr: "FORBIDDEN",
                        msg: "L'utilisateur " + req.body.userName + " existe déjà !"
                    })
                }
                else {
                    const newUser = {
                        id: utils.createID(),
                        username: req.body.userName,
                        password: utils.hashPassword(req.body.password)
                    }

                    dbClient.put({
                        TableName: 'egenum-users',
                        Item: newUser
                    }, (error, data) => {
                        if(error) {
                            console.log("CANNOT CREATE NEW USER")
                            next(error)
                        }
                        else {
                            //Success
                            res.status(200).json({
                                status: 200,
                                statusStr: "OK",
                                msg: "L'utilisateur " + newUser.username + " a créé avec succes",
                            })
                        }
                    })
                }
            }
        })
    }*/
}