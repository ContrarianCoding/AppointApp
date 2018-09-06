package com.example.me.getaline;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class LogInActiv extends AppCompatActivity
{

    Button loginBtn, sighUpbtn;
    TextView tvEmail, tvPassword;
    String insideTextView;



    @Override
    protected void onCreate(Bundle savedInstanceState)
    {


        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_log_in);

        loginBtn = (Button) findViewById(R.id.logIn);
        sighUpbtn = (Button) findViewById(R.id.signUp);
        tvEmail = (TextView) findViewById(R.id.email);
        tvPassword = (TextView) findViewById(R.id.password);


        loginBtn.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                Intent intent = new Intent(LogInActiv.this, DateAndClientActiv.class);
                Toast.makeText(LogInActiv.this, "You are connected as " + tvEmail.getText().toString(), Toast.LENGTH_SHORT).show();
                insideTextView = tvEmail.getText().toString();
                intent.putExtra("User", insideTextView);
                //sent data to activity InsideSpesificTime
                SharedPreferences prefs = getSharedPreferences("my_prefs", MODE_PRIVATE);
                SharedPreferences.Editor edit = prefs.edit();
                edit.putString("eMail", tvEmail.getText().toString() );
                edit.commit();

                startActivity(intent);
            }
        });



        sighUpbtn.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                Intent intent = new Intent(LogInActiv.this, SignUpActivity.class);
                Toast.makeText(LogInActiv.this, "You are in sign up", Toast.LENGTH_SHORT).show();

                startActivity(intent);
            }
        });






    }
}
