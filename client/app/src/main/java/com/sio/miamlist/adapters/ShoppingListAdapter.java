package com.sio.miamlist.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.sio.miamlist.R;

import java.util.List;

public class ShoppingListAdapter extends RecyclerView.Adapter<ShoppingListAdapter.ViewHolder> {

    public interface OnListActionListener {
        void onListClick(int id, String name);
        void onListDelete(int id);
    }

    private final List<ListItem> items;
    private final OnListActionListener listener;

    public ShoppingListAdapter(List<ListItem> items, OnListActionListener listener) {
        this.items    = items;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.activity_shopping_list, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ListItem item = items.get(position);
        holder.tvName.setText(item.name);
        holder.itemView.setOnClickListener(v -> listener.onListClick(item.id, item.name));
        holder.btnDelete.setOnClickListener(v -> listener.onListDelete(item.id));
    }

    @Override
    public int getItemCount() { return items.size(); }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName;
        ImageButton btnDelete;
        ViewHolder(View v) {
            super(v);
            tvName    = v.findViewById(R.id.tvListName);
            btnDelete = v.findViewById(R.id.btnDeleteList);
        }
    }

    // Modèle simple
    public static class ListItem {
        public int id;
        public String name;
        public ListItem(int id, String name) { this.id = id; this.name = name; }
    }
}