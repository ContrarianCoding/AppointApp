package com.example.me.getaline;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.firebase.client.DataSnapshot;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;
import com.firebase.client.ValueEventListener;

public class InsideClient extends AppCompatActivity
{
    Button btnInLv;
    ListView lv;
    TextView tvDate, tvClient;
    String date, client, chosenTime;
    String time[] = {"9:00-14:00","14:00-19:00"};
    Firebase myFirebaseRef;




    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inside_client);


        tvDate = (TextView) findViewById(R.id.Date_text);
        tvClient = (TextView) findViewById(R.id.idClient);



        
        
        populateTimeList();
        Intent intent = getIntent();

        client = intent.getStringExtra("selectedClient");
        tvClient.setText(client);
        date = intent.getStringExtra("selectedDate");
        tvDate.setText("on " + date);


    }

    private void populateTimeList()
    {
        lv = (ListView) findViewById(R.id.listView);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(
                this,
                R.layout.item,
                time);

        lv.setAdapter(adapter);

        //Read data from db time

//        myFirebaseRef.addValueEventListener(new ValueEventListener() {
//            @Override
//            public void onDataChange(DataSnapshot dataSnapshot) {
//                String SuperData = String.valueOf(dataSnapshot.getValue());
//                Toast.makeText(InsideClient.this, SuperData, Toast.LENGTH_LONG).show();
//            }
//
//            @Override
//            public void onCancelled(FirebaseError error) {
//            }
//        });







        lv.setOnItemClickListener(new AdapterView.OnItemClickListener()
        {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id)
            {
                chosenTime = (String) parent.getItemAtPosition(position);
                Intent intent = new Intent(InsideClient.this, InsideSpesificTime.class);
                intent.putExtra("selectedClient", client);
                intent.putExtra("selectedDate", date);
                intent.putExtra("selectedTime", chosenTime);
                startActivity(intent);

            }
        });

    }





}
