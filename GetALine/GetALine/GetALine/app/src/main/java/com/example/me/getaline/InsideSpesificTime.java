package com.example.me.getaline;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.firebase.client.ChildEventListener;
import com.firebase.client.DataSnapshot;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;
import com.firebase.client.ValueEventListener;

public class InsideSpesificTime extends AppCompatActivity implements View.OnClickListener
{

    TextView tvDesc, tvTime;
    Button btn;
    EditText et, etPhone = null;
    String description=null, spesificDate=null, spesificClent=null, email=null, phoneNum=null, spesificTime;
    SharedPreferences fromLogInUser;
    Firebase myFirebaseRef;







    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        Firebase.setAndroidContext(this);
        setContentView(R.layout.activity_inside_spesific_time);


        tvDesc = (TextView) findViewById(R.id.descrip);
        btn = (Button) findViewById(R.id.buttonOrder);
        et = (EditText) findViewById(R.id.idDescription);
        etPhone = (EditText) findViewById(R.id.phoneNum);
        tvTime = (TextView) findViewById(R.id.timeOrder);
        Intent intent = getIntent();


        spesificClent = intent.getStringExtra("selectedClient");
        spesificDate = intent.getStringExtra("selectedDate");
        spesificTime = intent.getStringExtra("selectedTime");
        tvDesc.setText("Write your description on time");
        tvTime.setText(spesificTime);


        btn.setOnClickListener(this);
        fromLogInUser = getSharedPreferences("my_prefs", MODE_PRIVATE);
        email = fromLogInUser.getString("eMail","");

    }


    @Override
    public void onClick(View v)
    {

        description = et.getText().toString();
        phoneNum = etPhone.getText().toString();

        myFirebaseRef = new Firebase("https://zimuntorim.firebaseio.com/");



        //myFirebaseRef.child(spesificClent+"/"+spesificDate).setValue("");
        //myFirebaseRef.child("Date"+"/"+email).setValue("");
        myFirebaseRef.child(spesificClent+"/"+spesificDate+"/"+spesificTime+"/"+description).setValue("description");
        myFirebaseRef.child(spesificClent+"/"+spesificDate+"/"+spesificTime+"/"+phoneNum).setValue("phoneNum");

//        myFirebaseRef.child(spesificClent+"/"+description).setValue("");
//        myFirebaseRef.child(spesificClent+"/"+spesificTime).setValue("");
//        myFirebaseRef.child(spesificClent+"/"+spesificClent).setValue("");




        //myFirebaseRef.setValue({data:"12/05/16"});

//        myFirebaseRef.child("Date/email").setValue(email);
//        myFirebaseRef.child("Date/UserPhone").setValue(phoneNum);
//        myFirebaseRef.child("Date/Description").setValue(description);
//        myFirebaseRef.child("Date/SpesificTime").setValue(spesificTime);

        //myFirebaseRef.child("User").setValue(email);
        //myFirebaseRef.child("Description").setValue(description);
        //myFirebaseRef.child("UserPhone").setValue(phoneNum);
        //myFirebaseRef.child("SpesificTime").setValue(spesificTime);
        //myFirebaseRef.child("Client").setValue(spesificClent);







        //Toast.makeText(getApplicationContext(), "YOUR ORDER DONE FOR TIME " + spesificTime, Toast.LENGTH_SHORT).show();




//        Intent intentmail = new Intent(Intent.ACTION_SENDTO, Uri.fromParts("mailto", "iliyab09@gmail.com", null));
//        intentmail.putExtra(Intent.EXTRA_SUBJECT, "Hello, I would like to order a technician for " +spesificDate + " between " + time);
//        intentmail.putExtra(Intent.EXTRA_TEXT,
//                "Name: "+name +"\n"
//                        + "Last Name: "+ last +"\n"
//                        + "City: "+ city +"\n"
//                        +"Street: "+street+" " +num+"\n"
//                        +"Apartment: "+apt +"\n"
//                        +"Description: "+description);
//        startActivity(Intent.createChooser(intentmail, "iliyab09@gmail.com"));
//        finish();

    }

}