# GSP Transformer Core - Training & Generation Script
# Use this script to train on ai_training_data.json and federated_training_buffer.json

import tensorflow as tf
from tensorflow.keras import layers
import numpy as np
import json

SEQ_LEN = 100

# ===============================
# REDEFINE TRANSFORMER BLOCK
# ===============================
@tf.keras.utils.register_keras_serializable(package="Custom")
class TransformerBlock(layers.Layer): 
    def __init__(self, embed_dim, num_heads, ff_dim, rate=0.1, **kwargs):
        super().__init__(**kwargs)
        self.embed_dim = embed_dim
        self.num_heads = num_heads
        self.ff_dim = ff_dim
        self.rate = rate

        self.att = layers.MultiHeadAttention(
            num_heads=num_heads, key_dim=embed_dim
        )

        self.ffn = tf.keras.Sequential(
            [
                layers.Dense(ff_dim, activation="gelu"),
                layers.Dense(embed_dim),
            ]
        )

        self.layernorm1 = layers.LayerNormalization(epsilon=1e-6)
        self.layernorm2 = layers.LayerNormalization(epsilon=1e-6)
        self.dropout1 = layers.Dropout(rate)
        self.dropout2 = layers.Dropout(rate)

    def call(self, inputs, training=False):
        attn_output = self.att(inputs, inputs, use_causal_mask=True)
        out1 = self.layernorm1(inputs + attn_output)
        return self.layernorm2(out1 + self.ffn(out1))

    def get_config(self):
        config = super().get_config()
        config.update({
            "embed_dim": self.embed_dim,
            "num_heads": self.num_heads,
            "ff_dim": self.ff_dim,
            "rate": self.rate,
        })
        return config

# ===============================
# GENERATE FUNCTION
# ===============================
def generate_text(model, prompt, char2idx, idx2char,
                  length=150, temperature=1.0):

    tokens = [char2idx.get(c, 0) for c in prompt]
    input_eval = tf.expand_dims(tokens, 0)

    if input_eval.shape[1] < SEQ_LEN:
        pad_len = SEQ_LEN - input_eval.shape[1]
        input_eval = tf.concat(
            [tf.zeros((1, pad_len), dtype=tf.int32), input_eval],
            axis=1
        )

    generated = []

    for _ in range(length):
        predictions = model(input_eval[:, -SEQ_LEN:])
        predictions = predictions[:, -1, :] / temperature
        predicted_id = tf.random.categorical(
            predictions, num_samples=1
        )[0, 0].numpy()

        input_eval = tf.concat(
            [input_eval, [[predicted_id]]],
            axis=1
        )
        input_eval = input_eval[:, -SEQ_LEN:]

        generated.append(idx2char[predicted_id])

    return prompt + "".join(generated)

# Add training loops here to read from ai_training_data.json
