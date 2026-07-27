import json

import config

BEAT_LEN = config.BEAT_LEN


def load_ecg_chunks(filepath, beat_len=BEAT_LEN):
    print(f"Loading ECG chunks from {filepath}...")
    with open(filepath, encoding="utf-8") as f:
        chunks = json.load(f)

    if not chunks:
        raise ValueError("ECG chunks file is empty")

    sample_len = len(chunks[0])
    if sample_len != beat_len:
        raise ValueError(
            f"Expected {beat_len} samples per chunk, got {sample_len} in {filepath}"
        )

    print(f"Loaded {len(chunks)} ECG chunks ({sample_len} samples each)")
    return chunks


def load_ecg_datasets(normal_path, abnormal_path, beat_len=BEAT_LEN):
    return load_ecg_chunks(normal_path, beat_len), load_ecg_chunks(
        abnormal_path, beat_len
    )
