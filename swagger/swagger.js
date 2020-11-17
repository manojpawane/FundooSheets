module.exports={
    "swagger": "2.0",
    "info": {
        "title": "fundoo Sheet User",
        "description": "",
        "version": "1.0"
    },
    "produces": [
        "application/json"
    ],
    "host": process.env.USER_API_URL+"/api",
    "paths": {
        "/register": {
            "post": {
                "x-swagger-router-controller": "user",
                "operationId": "register",
                "tags": [
                    "user"
                ],
                "description": "Register the user ",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "type": "object",
                        "reguired": true,
                        "schema": {
                            "$ref": "#/definitions/register"
                        }
                    }
                ],
                "responses": {}
            }
        },
        "/login": {
            "post": {
                "x-swagger-router-controller": "user",
                "operationId": "login",
                "tags": [
                    "user"
                ],
                "description": "Register the user ",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "type": "object",
                        "reguired": true,
                        "schema": {
                            "$ref": "#/definitions/login"
                        }
                    }
                ],
                "responses": {}
            }
        },
        "/forgot": {
            "post": {
                "x-swagger-router-controller": "user",
                "operationId": "forgotPassword",
                "tags": [
                    "user"
                ],
                "description": "Forgot password for the user ",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "type": "object",
                        "reguired": true,
                        "schema": {
                            "$ref": "#/definitions/forgot"
                        }
                    }
                ],
                "responses": {}
            }
        },
        "/reset": {
            "post": {
                "x-swagger-router-controller": "user",
                "operationId": "resetPassword",
                "tags": [
                    "user"
                ],
                "description": "Reset password for the user ",
                "parameters": [
                    {
                        "name": "authorization",
                        "in": "header",
                        "type": "string",
                        "reguired": true
                    },
                    {
                        "name": "body",
                        "in": "body",
                        "type": "object",
                        "reguired": true,
                        "schema": {
                            "$ref": "#/definitions/reset"
                        }
                    }
                ],
                "responses": {}
            }
        }
    },
    "definitions": {
        "register": {
            "type": "object",
            "properties": {
                "user": {
                    "type": "object",
                    "properties": {
                        "email": {
                            "type": "String"
                        },
                        "password": {
                            "type": "String"
                        }
                    }
                }
            },
            "example": {
                "user": {
                    "email": "nagendra.singh@bridgelabz.com",
                    "password": "abcd1234"
                }
            }
        },
        "login": {
            "type": "object",
            "properties": {
                "user": {
                    "type": "object",
                    "properties": {
                        "email": {
                            "type": "String"
                        },
                        "password": {
                            "type": "String"
                        }
                    }
                }
            },
            "example": {
                "user": {
                    "email": "nagendra.singh@bridgelabz.com",
                    "password": "abcd1234"
                }
            }
        },

        "forgot": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "String"
                }
            },
            "example": {
                "email": "nagendra@bridgelabz.com"
            }
        },
        "reset": {
            "type": "object",
            "properties": {
                "password": {
                    "type": "String"
                }
            },
            "example": {
                "password": "abcd1234"
            }
        }
    }
}