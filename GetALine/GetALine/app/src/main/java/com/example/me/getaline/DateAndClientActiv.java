package com.example.me.getaline;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.Spinner;

public class DateAndClientActiv extends AppCompatActivity implements AdapterView.OnItemSelectedListener
{

    Button btnInCalendar;
    Spinner spinnerSpin;
    ArrayAdapter adapterSpin;
    DatePicker dp;
    String selectedClient;


    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_date_and_client);

//dugma
        spinnerSpin = (Spinner) findViewById(R.id.spinner2);
        btnInCalendar = (Button) findViewById(R.id.calendar_button);
        dp = (DatePicker) findViewById(R.id.datePicker);

        adapterSpin = ArrayAdapter.createFromResource(this, R.array.clients, android.R.layout.simple_list_item_activated_1);
        spinnerSpin.setAdapter(adapterSpin);

        spinnerSpin.setOnItemSelectedListener(DateAndClientActiv.this);

        btnInCalendar.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {

                Intent intent = new Intent(DateAndClientActiv.this, InsideClient.class);
                intent.putExtra("selectedDate", dp.getDayOfMonth() + "-" + (dp.getMonth() + 1) + "-" + dp.getYear());
                intent.putExtra("selectedClient", selectedClient);
                startActivity(intent);
            }
        });


    }


    @Override
    public void onItemSelected (AdapterView < ? > parent, View view,int position, long id)
    {
        selectedClient = spinnerSpin.getSelectedItem().toString();
        //Toast.makeText(DateAndClientActiv.this, "you Clicked" + selectedClient, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onNothingSelected (AdapterView < ? > parent)
    {

    }
}





