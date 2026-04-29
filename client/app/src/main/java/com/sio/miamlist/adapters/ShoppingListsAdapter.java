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

public class ShoppingListsAdapter extends RecyclerView.Adapter<ShoppingListsAdapter.ViewHolder> {

    public interface OnListActionListener {
        void onListClick(int id, String name);
        void onListDelete(int id, String name);
    }

    private final List<ListItem> listsItem;
    private final OnListActionListener listener;

    public ShoppingListsAdapter(List<ListItem> listsItem, OnListActionListener listener) {
        this.listsItem = listsItem;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(
            R.layout.item_shopping_lists, parent, false
        );
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ListItem listItem = listsItem.get(position);
        holder.tvName.setText(listItem.name);
        holder.itemView.setOnClickListener(v -> listener.onListClick(listItem.id, listItem.name));
        holder.btnDelete.setOnClickListener(v -> listener.onListDelete(listItem.id, listItem.name));
    }

    @Override
    public int getItemCount() { return listsItem.size(); }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName;
        ImageButton btnDelete;
        ViewHolder(View v) {
            super(v);
            tvName    = v.findViewById(R.id.tvListName);
            btnDelete = v.findViewById(R.id.btnDeleteList);
        }
    }

    public static class ListItem {
        public int id;
        public String name;
        public ListItem(int id, String name) { this.id = id; this.name = name; }
    }
}
