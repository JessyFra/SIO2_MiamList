package com.sio.miamlist.adapters;

import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;

import com.sio.miamlist.R;

import java.util.Collections;
import java.util.List;

public class ShoppingListsAdapter extends RecyclerView.Adapter<ShoppingListsAdapter.ViewHolder> {

    public interface OnListActionListener {
        void onListClick(int id, String name);
        void onListDelete(int id, String name);
    }

    /** Callback fourni par l'activité pour démarrer un drag depuis le handle. */
    public interface DragListener {
        void startDrag(ViewHolder holder);
    }

    private final List<ListItem>        listsItem;
    private final OnListActionListener  listener;
    private DragListener                dragListener;

    public ShoppingListsAdapter(List<ListItem> listsItem, OnListActionListener listener) {
        this.listsItem = listsItem;
        this.listener  = listener;
    }

    public void setDragListener(DragListener dl) {
        this.dragListener = dl;
    }

    /** Déplace un élément dans la liste locale (appelé par ItemTouchHelper). */
    public void onItemMoved(int from, int to) {
        Collections.swap(listsItem, from, to);
        notifyItemMoved(from, to);
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

        // Bande orange gauche = poignée de glissement
        if (dragListener != null && holder.dragHandle != null) {
            holder.dragHandle.setOnTouchListener((v, event) -> {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    dragListener.startDrag(holder);
                }
                return false;
            });
        }
    }

    @Override
    public int getItemCount() { return listsItem.size(); }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView    tvName;
        ImageButton btnDelete;
        View        dragHandle;

        ViewHolder(View v) {
            super(v);
            tvName     = v.findViewById(R.id.tvRecipeName);
            btnDelete  = v.findViewById(R.id.btnDeleteList);
            dragHandle = v.findViewById(R.id.dragHandle);
        }
    }

    public static class ListItem {
        public int    id;
        public String name;
        public ListItem(int id, String name) { this.id = id; this.name = name; }
    }
}
