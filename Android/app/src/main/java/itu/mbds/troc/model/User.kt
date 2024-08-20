package itu.mbds.troc.model

data class User(
    val username: String,
    val name: String,
    val password: String,
    val email: String,
    val phone: String,
    val address: String,
    val role: String = "user"
)