package com.sio.miamlist.adapters;

import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.sio.miamlist.R;

import java.util.Collections;
import java.util.List;

public class RecipeAdapter extends RecyclerView.Adapter<RecipeAdapter.ViewHolder> {

    public interface OnProductActionListener {
        void onEdit(RecipeItem item);
        void onDelete(RecipeItem item);
    }

    public interface DragListener {
        void startDrag(ViewHolder holder);
    }

    public static class RecipeItem {
        public int    listItemId;
        public int    productId;
        public String label;
        public float  quantity;
        public String unit;

        public RecipeItem(int listItemId, int productId, String label,
                          float quantity, String unit) {
            this.listItemId = listItemId;
            this.productId  = productId;
            this.label      = label;
            this.quantity   = quantity;
            this.unit       = unit;
        }
    }

    private final List<RecipeItem>        items;
    private final OnProductActionListener listener;
    private DragListener                  dragListener;

    public RecipeAdapter(List<RecipeItem> items, OnProductActionListener listener) {
        this.items    = items;
        this.listener = listener;
    }

    public void setDragListener(DragListener dl) {
        this.dragListener = dl;
    }

    public void onItemMoved(int from, int to) {
        Collections.swap(items, from, to);
        notifyItemMoved(from, to);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_recipe_product, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        RecipeItem item = items.get(position);

        holder.tvLabel.setText(item.label);
        bindQtyUnit(holder, item);

        holder.btnEdit.setOnClickListener(v -> listener.onEdit(item));
        holder.btnDelete.setOnClickListener(v -> listener.onDelete(item));

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
    public int getItemCount() { return items.size(); }

    private void bindQtyUnit(ViewHolder holder, RecipeItem item) {
        if (item.quantity > 0) {
            String qty  = item.quantity == (int) item.quantity
                    ? String.valueOf((int) item.quantity)
                    : String.valueOf(item.quantity);
            String text = (item.unit != null && !item.unit.isEmpty())
                    ? qty + " " + item.unit : qty;
            holder.tvQtyUnit.setText(text);
            holder.tvQtyUnit.setVisibility(View.VISIBLE);
        } else {
            holder.tvQtyUnit.setVisibility(View.GONE);
        }
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView    tvLabel;
        TextView    tvQtyUnit;
        ImageButton btnEdit;
        ImageButton btnDelete;
        View        dragHandle;

        ViewHolder(View v) {
            super(v);
            tvLabel    = v.findViewById(R.id.tvProductLabel);
            tvQtyUnit  = v.findViewById(R.id.tvProductQtyUnit);
            btnEdit    = v.findViewById(R.id.btnEditProduct);
            btnDelete  = v.findViewById(R.id.btnDeleteProduct);
            dragHandle = v.findViewById(R.id.dragHandle);
        }
    }
}
