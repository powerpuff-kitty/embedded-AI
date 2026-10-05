from pathlib import Path
import json
import tempfile
import unittest
import numpy as np
from recipes.forecast import decompose,fit,predict,save_model,load_model
from recipes.samples import generate
from recipes.vad import segments
from recipes.pose import Tracker
from bench.runner import percentile,run,host
from bench.coexist import measure

class Recipes(unittest.TestCase):
    def setUp(self):
        self.values=np.sin(np.arange(800)*2*np.pi/24)+np.arange(800)*.001
    def test_forecast_split_scaler_and_shape(self):
        model,report=fit(self.values)
        self.assertEqual(report['parameters'],4656)
        self.assertAlmostEqual(model['mean'],self.values[:480].mean())
        self.assertEqual(predict(self.values[-96:][None],model).shape,(1,24))
        altered=self.values.copy();altered[640:]+=1000
        other,_=fit(altered)
        np.testing.assert_array_equal(model['ws'],other['ws'])
    def test_forecast_roundtrip_and_bad_inputs(self):
        model,_=fit(self.values)
        with tempfile.TemporaryDirectory() as directory:
            p=Path(directory)/'model.npz';save_model(p,model);loaded=load_model(p)
            np.testing.assert_array_equal(predict(self.values[-96:][None],model),predict(self.values[-96:][None],loaded))
        with self.assertRaises(ValueError):fit(np.array([np.nan]*800))
        with self.assertRaises(ValueError):decompose(np.ones((1,20)),4)
    def test_synthetic_fixture_provenance(self):
        with tempfile.TemporaryDirectory() as directory:
            generate(Path(directory));lines=(Path(directory)/'skeleton.jsonl').read_text().splitlines()
            self.assertTrue(json.loads(lines[0])['not_model_output']);self.assertEqual(len(lines),61)
    def test_segment_negative_positive_and_flush(self):
        self.assertEqual(segments([0]*20,.64),[])
        found=segments([0]*3+[.9]*20+[0]*5,.896)
        self.assertEqual(len(found),1);self.assertGreater(found[0]['end'],found[0]['start'])
        self.assertEqual(len(segments([.9]*20,.64)),1)
        with self.assertRaises(ValueError):segments([1],1,threshold=1)
    def test_tracker_one_to_one_and_missing(self):
        tracker=Tracker();pose=[[50,50,1]]*17
        a=tracker.update([pose],100,100);b=tracker.update([pose],100,100)
        self.assertEqual(a[0]['track_id'],b[0]['track_id'])
        pair=tracker.update([pose,pose],100,100)
        self.assertEqual(len({p['track_id'] for p in pair}),2)
        self.assertIsNone(tracker.update([[None]*17],100,100)[0]['track_id'])
    def test_real_isolated_benchmark(self):
        model,_=fit(self.values)
        with tempfile.TemporaryDirectory() as directory:
            p=Path(directory)/'model.npz';save_model(p,model)
            result=run('dlinear',{'model':str(p)},samples=5,warmup=1,timeout=30)
            self.assertEqual(result['samples'],5);self.assertGreater(result['process_peak_rss_mb'],0)
            self.assertTrue(result['output_check']['finite']);self.assertIn('id',result['hardware'])
            self.assertEqual(len(result['model']['artifact_sha256']),64)
    def test_invalid_configs_and_failure_do_not_make_evidence(self):
        with self.assertRaises(ValueError):run('unknown',{},1,0)
        with self.assertRaises(ValueError):run('dlinear',{},0,0)
        with self.assertRaises(ValueError):run('dlinear',{},1,0,timeout=float('nan'))
        with self.assertRaises(RuntimeError):run('dlinear',{'model':'missing.npz'},1,0)
        with self.assertRaises(TimeoutError):run('dlinear',{'model':'missing.npz'},1,0,timeout=.0001)
        with self.assertRaises(ValueError):measure({'processes':[]})
    def test_percentile_and_host(self):
        self.assertEqual(percentile([10,20],.5),15);self.assertTrue(host()['id'])
        with self.assertRaises(ValueError):percentile([],1)

if __name__=='__main__':unittest.main()
