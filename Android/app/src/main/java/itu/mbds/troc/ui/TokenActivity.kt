package itu.mbds.troc.ui

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import itu.mbds.troc.R
import android.widget.TextView

class TokenActivity : AppCompatActivity() {

    private lateinit var tokenTextView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_token)

        tokenTextView = findViewById(R.id.tokenTextView)

        val token = intent.getStringExtra("TOKEN")
        tokenTextView.text = token
    }
}